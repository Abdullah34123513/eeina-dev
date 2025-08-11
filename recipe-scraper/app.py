# app.py
from flask import Flask, request
from recipe_scrapers import scrape_me

app = Flask(__name__)


# root route
@app.route("/", methods=["GET"])
def home():
    return "Hello, World!"


# route to scrape a recipe
@app.route("/scrape", methods=["GET"])
def scrape_recipe():
    # get the URL from the query string
    url = request.args.get("url")

    if not url:
        return {"success": False, "message": "no URL provided"}
    try:
        # Scrape the recipe from the given URL
        scraper = scrape_me(url)

        json_data = scraper.to_json()  # Get the recipe data as JSON

        # Return a simple message to the browser
        return {
            "success": True,
            "data": json_data,
        }, 200  # Return HTTP status code 200 (OK)
    except Exception as e:
        return {
            "success": False,
            "message": "This site is not supported",
        }, 500  # Return HTTP status code 500 (Internal Server Error)


if __name__ == "__main__":
    # Run the app on port 5000
    app.run(port=5000)
