import * as lancedb from "@lancedb/lancedb";
import * as arrow from "apache-arrow";
// import * as lancedb from "vectordb";
import path from "path";
// import "@lancedb/lancedb/embedding/openai";
import fs from "fs";
import { parse as parseSync } from "csv-parse/sync";
import { OpenAI } from "openai";

// Initialize LanceDB

// Initialize OpenAI client
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate embeddings using OpenAI
async function generateEmbedding(text: string) {
  const response = await openaiClient.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data[0].embedding;
}

const tableName = "movies";

interface Movie {
  movieId: string;
  title: string;
  genres: string;
  tags: string;
  avgRating: string;
  imdbLink: string;
  textToEmbed: string;
}

// Setup LanceDB with movie data from unified CSV
async function setupLanceDB() {
  try {
    const db = await lancedb.connect({ uri: "/tmp/vectorflix" });
    const movies = loadProcessedMovies() as Movie[];

    // Generate embeddings for all movies
    const embeddings = await Promise.all(
      movies.map(async (movie) => await generateEmbedding(movie.textToEmbed)),
    );

    // Prepare data for LanceDB
    const data = movies.map((movie: Movie, index) => ({
      movieId: parseInt(movie.movieId),
      title: movie.title,
      genres: movie.genres,
      tags: movie.tags,
      avgRating: movie.avgRating,
      imdbLink: movie.imdbLink,
      vector: embeddings[index],
    }));

    const table = await db.createTable(tableName, data, { mode: "overwrite" });
    // const table = await db.createTable(tableName, data, {
    //   writeMode: lancedb.WriteMode.Overwrite,
    // });

    console.log("LanceDB table created successfully");
    return table.name;
  } catch (error) {
    console.error("Error setting up LanceDB:", error);
    throw error;
  }
}

// Search movies based on a query
async function searchMovies(query: string, limit = 10) {
  try {
    const db = await lancedb.connect("/tmp/vectorflix");
    const table = await db.openTable(tableName);
    const queryEmbedding = await generateEmbedding(query);
    const results = await table.search(queryEmbedding).limit(limit).toArray();
    return results.map((result) => ({
      movieId: result.movieId,
      title: result.title,
      genres: result.genres,
      tags: result.tags,
      avgRating: result.avgRating,
      imdbLink: result.imdbLink,
    }));
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
}

// Load the unified CSV (for use in the server)
const appRoot = process.cwd();
console.log(`App root: ${appRoot}`);
function loadProcessedMovies() {
  console.log("Loading processed movies from CSV...");
  const filePath = path.join(appRoot, "data", "processed_movies.csv");
  console.log(`File path: ${filePath}`);
  try {
    console.log(`Attempting to load file (sync): ${filePath}`);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    console.log(`File content length: ${fileContent.length} characters`);
    const records = parseSync(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    const result = Array.from(records);
    console.log(`Parsed ${result.length} records from ${filePath}`);
    return result;
  } catch (error) {
    console.error(`Error loading CSV file (sync) ${filePath}:`, error);
    throw error;
  }
}

export { setupLanceDB, searchMovies };
