const connectDb = require('../config/database');
const Plant = require("../models/plant");

const plants = [
  { name: "Snake Plant", price: 300, categories: ["Indoor", "Air Purifying"], available: true, profile: "http://googleusercontent.com/image_collection/image_retrieval/16507850723012248914_0" },
  { name: "Money Plant", price: 250, categories: ["Indoor", "Decorative"], available: true, profile: "http://googleusercontent.com/image_collection/image_retrieval/6023934413210645987_0" },
  { name: "Aloe Vera", price: 150, categories: ["Medicinal", "Succulent"], available: true, profile: "http://googleusercontent.com/image_collection/image_retrieval/12327676334578490511_0" },
  { name: "Tulsi", price: 100, categories: ["Medicinal"], available: true, profile: "http://googleusercontent.com/image_collection/image_retrieval/17529892154646817885_0" },
  { name: "Rose", price: 200, categories: ["Flowering", "Outdoor"], available: true, profile: "http://googleusercontent.com/image_collection/image_retrieval/16507850723012248914_1" },
  { name: "Jasmine", price: 300, categories: ["Flowering", "Outdoor"], available: true, profile: "http://googleusercontent.com/image_collection/image_retrieval/6023934413210645987_1" },
  { name: "Lavender", price: 150, categories: ["Medicinal"], available: true, profile: "http://googleusercontent.com/image_collection/image_retrieval/12327676334578490511_1" },
  { name: "Lily", price: 250, categories: ["Flowering", "Outdoor"], available: true, profile: "http://googleusercontent.com/image_collection/image_retrieval/17529892154646817885_1" },
  { name: "Tulip", price: 100, categories: ["Flowering", "Outdoor"], available: true, profile: "http://googleusercontent.com/image_collection/image_retrieval/16507850723012248914_2" },
  { name: "Carnation", price: 200, categories: ["Flowering", "Outdoor"], available: true, profile: "http://googleusercontent.com/image_collection/image_retrieval/6023934413210645987_2" },
  { name: "Daffodil", price: 150, categories: ["Flowering", "Outdoor"], available: true, profile: "http://googleusercontent.com/image_collection/image_retrieval/12327676334578490511_2" },
  { name: "Daisy", price: 100, categories: ["Flowering", "Outdoor"], available: true, profile: "http://googleusercontent.com/image_collection/image_retrieval/17529892154646817885_2" },
  { name: "Sunflower", price: 250, categories: ["Flowering", "Outdoor"], available: true, profile: "http://googleusercontent.com/image_collection/image_retrieval/16507850723012248914_3" },
  { name: "Orchid", price: 300, categories: ["Flowering", "Outdoor"], available: true, profile: "http://googleusercontent.com/image_collection/image_retrieval/6023934413210645987_3" },
  { name: "Lily of the Valley", price: 150, categories: ["Flowering", "Outdoor"], available: true, profile: "http://googleusercontent.com/image_collection/image_retrieval/12327676334578490511_3" },
  { name: "Peace Lily", price: 220, categories: ["Indoor", "Air Purifying"], available: true, profile: "http://googleusercontent.com/image_collection/image_retrieval/17529892154646817885_3" },
  { name: "Spider Plant", price: 180, categories: ["Indoor", "Air Purifying"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Rubber Plant", price: 350, categories: ["Indoor", "Decorative"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Fiddle Leaf Fig", price: 400, categories: ["Indoor", "Decorative"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Pothos", price: 120, categories: ["Indoor", "Air Purifying"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "ZZ Plant", price: 280, categories: ["Indoor", "Low Maintenance"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Cactus", price: 90, categories: ["Succulent", "Low Maintenance"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Succulent", price: 80, categories: ["Succulent", "Indoor"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Bamboo", price: 150, categories: ["Indoor", "Decorative"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Ivy", price: 130, categories: ["Indoor", "Climbing"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Fern", price: 160, categories: ["Indoor", "Decorative"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Bonsai", price: 500, categories: ["Indoor", "Decorative"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Calathea", price: 270, categories: ["Indoor", "Decorative"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Monstera", price: 380, categories: ["Indoor", "Decorative"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Philodendron", price: 220, categories: ["Indoor", "Air Purifying"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Basil", price: 70, categories: ["Herb", "Culinary"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Mint", price: 75, categories: ["Herb", "Culinary"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Rosemary", price: 85, categories: ["Herb", "Culinary"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Thyme", price: 80, categories: ["Herb", "Culinary"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Sage", price: 90, categories: ["Herb", "Medicinal"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Oregano", price: 75, categories: ["Herb", "Culinary"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Chrysanthemum", price: 180, categories: ["Flowering", "Outdoor"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Marigold", price: 110, categories: ["Flowering", "Outdoor"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Hydrangea", price: 320, categories: ["Flowering", "Outdoor"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Peony", price: 280, categories: ["Flowering", "Outdoor"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Dahlia", price: 190, categories: ["Flowering", "Outdoor"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Zinnia", price: 120, categories: ["Flowering", "Outdoor"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Pansy", price: 100, categories: ["Flowering", "Outdoor"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Petunia", price: 110, categories: ["Flowering", "Outdoor"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Geranium", price: 130, categories: ["Flowering", "Outdoor"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Begonia", price: 140, categories: ["Flowering", "Outdoor"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Azalea", price: 260, categories: ["Flowering", "Outdoor"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Camellia", price: 300, categories: ["Flowering", "Outdoor"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Magnolia", price: 450, categories: ["Flowering", "Outdoor"], available: true, profile: "https://images.unsplash.com/photo-1593482276921-655f2d715696?w=400&h=400&fit=crop" },
  { name: "Hibiscus", price: 220, categories: ["Flowering", "Outdoor"], available: true, profile: "https://m.media-amazon.com/images/I/71Jya7MRiWS._UF1000,1000_QL80_.jpg" }
];

const seedPlants = async () => {
  try {
    await connectDb();
    await Plant.deleteMany();
    await Plant.insertMany(plants);
    console.log(`Seeded ${plants.length} plants successfully!`);
    process.exit();
  } catch (err) {
    console.error("Error seeding plants:", err);
    process.exit(1);
  }
};

seedPlants();