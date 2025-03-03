const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const { parse: parseSync } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");

// Resolve paths relative to project root
const DATA_DIR = path.resolve(__dirname, "./data");

// Load CSV files synchronously for smaller files (movies.csv, tags.csv, links.csv)
function loadCSVSync(filePath) {
  try {
    console.log(`Attempting to load file (sync): ${filePath}`);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    console.log(`File content length: ${fileContent.length} characters`);
    const records = parseSync(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    const result = Array.from(records); // Convert to plain array
    console.log(`Parsed ${result.length} records from ${filePath}`);
    return result;
  } catch (error) {
    console.error(`Error loading CSV file (sync) ${filePath}:`, error.message);
    throw error;
  }
}

// Load CSV files with streaming for larger files (ratings.csv)
async function loadCSVStream(filePath, processRow) {
  return new Promise((resolve, reject) => {
    const results = {};
    console.log(`Attempting to load file (stream): ${filePath}`);
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on("data", (row) => processRow(results, row))
      .on("end", () => {
        console.log(`Finished streaming file: ${filePath}`);
        resolve(results);
      })
      .on("error", (error) => {
        console.error(`Error streaming CSV file ${filePath}:`, error.message);
        reject(error);
      });
  });
}

// Process movies.csv
function loadMovies(count) {
  const movies = loadCSVSync(path.join(DATA_DIR, "movies.csv"));
  console.log(`Loaded ${movies.length} movies from movies.csv`);
  return movies.slice(0, count); // Limit to specified count
}

// Process tags.csv: Aggregate tags by movieId
function loadTags() {
  const tags = loadCSVSync(path.join(DATA_DIR, "tags.csv"));
  const tagMap = {};

  tags.forEach((row) => {
    const movieId = parseInt(row.movieId);
    if (!tagMap[movieId]) {
      tagMap[movieId] = new Set();
    }
    tagMap[movieId].add(row.tag);
  });

  return Object.fromEntries(
    Object.entries(tagMap).map(([movieId, tagsSet]) => [
      movieId,
      Array.from(tagsSet).join(" "),
    ]),
  );
}

// Process ratings.csv: Compute average rating by movieId (streamed)
async function loadRatings() {
  const ratingMap = {};

  await loadCSVStream(path.join(DATA_DIR, "ratings.csv"), (results, row) => {
    const movieId = parseInt(row.movieId);
    const rating = parseFloat(row.rating);

    if (!results[movieId]) {
      results[movieId] = { sum: 0, count: 0 };
    }
    results[movieId].sum += rating;
    results[movieId].count += 1;
  }).then((results) => {
    Object.assign(ratingMap, results);
  });

  // Compute average ratings
  return Object.fromEntries(
    Object.entries(ratingMap).map(([movieId, { sum, count }]) => [
      movieId,
      (sum / count).toFixed(1),
    ]),
  );
}

// Process links.csv: Map movieId to IMDb link
function loadLinks() {
  const links = loadCSVSync(path.join(DATA_DIR, "links.csv"));
  const linkMap = {};

  links.forEach((row) => {
    const movieId = parseInt(row.movieId);
    const imdbId = row.imdbId.padStart(7, "0"); // Ensure IMDb ID is 7 digits
    const imdbLink = `https://www.imdb.com/title/tt${imdbId}/`;
    linkMap[movieId] = imdbLink;
  });

  return linkMap;
}

// Combine movies, tags, ratings, and links into a unified dataset
async function processMovies({
  count = 100,
  outputFile = path.join(DATA_DIR, "processed_movies.csv"),
} = {}) {
  try {
    const movies = loadMovies(count);
    if (movies.length === 0) {
      throw new Error("No movies loaded from movies.csv");
    }
    const tags = loadTags();
    const ratings = await loadRatings();
    const links = loadLinks();

    const processedData = movies.map((movie) => {
      const movieId = parseInt(movie.movieId);
      const movieTags = tags[movieId] || "";
      const avgRating = ratings[movieId] || "N/A";
      const imdbLink = links[movieId] || "";

      // Combine title, genres, and tags for embedding
      const textToEmbed =
        `${movie.title} ${movie.genres.replace(/\|/g, " ")} ${movieTags}`.trim();

      return {
        movieId,
        title: movie.title,
        genres: movie.genres,
        tags: movieTags,
        avgRating,
        imdbLink,
        textToEmbed,
      };
    });

    // Write to CSV
    const csvData = stringify(processedData, { header: true });
    fs.writeFileSync(outputFile, csvData);
    console.log(
      `Unified CSV written to ${outputFile} with ${processedData.length} movies`,
    );

    return processedData;
  } catch (error) {
    console.error("Error processing movies:", error.message);
    throw error;
  }
}

module.exports = { processMovies };

processMovies({ count: 500, outputFile: "data/processed_movies.csv" });
