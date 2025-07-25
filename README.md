# AI Recipe Finder

AI Recipe Finder is a web application that empowers users to discover and generate detailed recipes based on available ingredients or dish prompts. It uses **Gemini AI API** to provide accurate, personalized recipes to enhance your cooking experience.

## 🚀 Features

- **Suggest Cuisine:** Suggests possible cuisines based on selected ingredients.
- **Get Recipe:** Generates a detailed recipe for any entered dish name or combination of ingredients, including:
  - Preparation time
  - Cooking time
  - Servings
  - Ingredients list
  - Step-by-step instructions
  - Helpful tips
-  **About Us:** Displays information about the project creator and gives special credit to Professor M. Bilal for guidance.
- **User Authentication:** Secure login and signup system.

## 🛠️ Technologies Used

- **Frontend:** HTML, Tailwind CSS, JavaScript
- **Backend:** Flask (Python)
- **AI Integration:** Gemini AI API (Google Generative AI)
- **Database:** SQLite (for user authentication)

## 🎨 UI Design

The interface is clean, responsive, and user-friendly, with a modern gradient theme and intuitive navigation, designed using Tailwind CSS for quick and beautiful styling.

## 👤 Author

Developed by **Hammad Ur Rehman** as part of the **Software Construction and Development course** under the guidance of **Professor M. Bilal**, who provided insightful teaching and motivation throughout the development process.

## ✨ How to Run

1. Clone this repository:
    ```bash
    git clone https://github.com/yourusername/ai-recipe-finder.git
    cd ai-recipe-finder
    ```

2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3. Add your **Gemini AI API key** in your `.env` file:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

4. Run the application:
    ```bash
    python app.py
    ```

5. Visit **http://127.0.0.1:5000** in your browser.

## 💡 Future Improvements

- Image-based recipe suggestions.
- Nutritional information breakdown.
- Sharing recipes on social media.

## 📜 License

This project is for academic learning purposes.

---

> **Special Thanks:** To **Professor M. Bilal** for his guidance and motivation throughout this project.

