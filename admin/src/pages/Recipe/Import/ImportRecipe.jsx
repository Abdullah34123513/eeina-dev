import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Card, Form, Row, Col } from "react-bootstrap";
import handleApi from "../../../api/handler/apiHanlder";
import FadeLoader from "react-spinners/FadeLoader";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const loaderStyle = {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)", // Dark overlay
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      cursor: "wait",
};

const RecipeSearch = () => {
      let [loading, setLoading] = useState(false);
      const navigate = useNavigate();
      let [color, setColor] = useState("#6610f2");
      const { register, handleSubmit, watch } = useForm({
            defaultValues: {
                  random: false,
                  cuisines: "",
                  diet: "",
                  type: "",
                  number: 100,
                  offset: 0,
                  recipe_first_letter: "",
            },
      });

      const random = watch("random");
      const [recipes, setRecipes] = useState([]);
      const [showModal, setShowModal] = useState(false);
      const [uploadSuccess, setUploadSuccess] = useState(null);
      // We'll store the type locally in onSubmit instead of relying solely on state.
      const [dataType, setDataType] = useState("random");

      const cuisinesOptions = [
            "African", "Asian", "American", "British", "Cajun", "Caribbean", "Chinese",
            "Eastern European", "European", "French", "German", "Greek", "Indian", "Irish",
            "Italian", "Japanese", "Jewish", "Korean", "Latin American", "Mediterranean",
            "Mexican", "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"
      ];

      const dietOptions = [
            "Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian",
            "Vegan", "Pescetarian", "Paleo", "Primal", "Low FODMAP", "Whole30"
      ];

      const typeOptions = [
            "main course", "side dish", "dessert", "appetizer", "salad", "bread", "breakfast",
            "soup", "beverage", "sauce", "marinade", "fingerfood", "snack", "drink"
      ];

      const onSubmit = async (data) => {
            setLoading(true);
            let params = {};
            let body = {};
            // Determine the type locally.
            const type = data.random ? "random" : "ids";
            setDataType(type);

            if (type === "random") {
                  body = { random: true, number: data.number, offset: data.offset };
            } else {
                  if (data.cuisines) params.cuisines = data.cuisines;
                  if (data.diet) params.diet = data.diet;
                  if (data.type) params.type = data.type;
                  if (data.recipe_first_letter) params.recipe_first_letter = data.recipe_first_letter;
                  params.number = data.number;
                  params.offset = data.offset;
            }

            try {
                  const response = await handleApi(
                        "recipe/api-get",
                        "get",
                        type === "random" ? body : params
                  );
                  console.log("Response:", response); // Debugging
                  if (response?.data?.recipes || response?.data?.results) {
                        setRecipes(response.data.recipes || response.data.results);
                        setShowModal(true);
                  }
            } catch (error) {
                  console.error("Error fetching recipes:", error);
            } finally {
                  setLoading(false);
            }
      };

      const handleUpload = async () => {
            setLoading(true);
            if (!recipes || !recipes.length) {
                  console.error("No recipes to upload!");
                  setLoading(false);
                  return;
            }

            try {
                  // Use a new variable name to avoid shadowing the state variable.
                  let recipeData = recipes;
                  if (dataType === "ids") {
                        // Map over the outer recipes state to extract ids.
                        recipeData = recipes.map((recipe) => recipe.id);
                  }

                  const res = await handleApi("recipe/save-recipe", "post", {
                        recipeData,
                        recipeApiType: dataType,
                  });
                  console.log("Upload response:", res); // Debugging

                  toast.success(`${res?.data?.successCount} recipes imported successfully!`);
                  setUploadSuccess(res?.data?.success || false);
                  setShowModal(false);
                  navigate("/all-import-recipes");
            } catch (error) {
                  console.error("Error uploading recipes:", error?.response?.data || error.message);
                  setUploadSuccess(false);
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="container mt-4">
                  <h2>Recipe Search</h2>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group controlId="randomCheckbox">
                              <Form.Check type="checkbox" label="Random" {...register("random")} />
                        </Form.Group>
                        <Row>
                              <Col md={4}>
                                    <Form.Group controlId="cuisinesSelect">
                                          <Form.Label>Cuisines</Form.Label>
                                          <Form.Control as="select" {...register("cuisines")} disabled={random}>
                                                <option value="">Select Cuisine</option>
                                                {cuisinesOptions.map((cuisine, index) => (
                                                      <option key={index} value={cuisine}>{cuisine}</option>
                                                ))}
                                          </Form.Control>
                                    </Form.Group>
                              </Col>
                              <Col md={4}>
                                    <Form.Group controlId="dietSelect">
                                          <Form.Label>Diet</Form.Label>
                                          <Form.Control as="select" {...register("diet")} disabled={random}>
                                                <option value="">Select Diet</option>
                                                {dietOptions.map((diet, index) => (
                                                      <option key={index} value={diet}>{diet}</option>
                                                ))}
                                          </Form.Control>
                                    </Form.Group>
                              </Col>
                              <Col md={4}>
                                    <Form.Group controlId="typeSelect">
                                          <Form.Label>Type</Form.Label>
                                          <Form.Control as="select" {...register("type")} disabled={random}>
                                                <option value="">Select Type</option>
                                                {typeOptions.map((type, index) => (
                                                      <option key={index} value={type}>{type}</option>
                                                ))}
                                          </Form.Control>
                                    </Form.Group>
                              </Col>
                        </Row>
                        <Row className="mt-3">
                              <Col md={4}>
                                    <Form.Group controlId="numberInput">
                                          <Form.Label>Number</Form.Label>
                                          <Form.Control type="number" {...register("number")} />
                                    </Form.Group>
                              </Col>
                              <Col md={4}>
                                    <Form.Group controlId="offsetInput">
                                          <Form.Label>Offset</Form.Label>
                                          <Form.Control type="number" {...register("offset")} />
                                    </Form.Group>
                              </Col>
                              <Col md={4}>
                                    <Form.Group controlId="recipeFirstLetter">
                                          <Form.Label>Recipe First Letter</Form.Label>
                                          <Form.Control
                                                type="text"
                                                {...register("recipe_first_letter")}
                                                placeholder="Enter first letter"
                                                disabled={random}
                                          />
                                    </Form.Group>
                              </Col>
                        </Row>
                        <Button variant="primary" type="submit" className="mt-3">
                              Search Recipes
                        </Button>
                  </Form>

                  <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                        <Modal.Header closeButton>
                              <Modal.Title>Recipes</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                              <div className="row">
                                    {recipes.length > 0 ? (
                                          recipes.map((recipe, index) => (
                                                <div className="col-md-4 mb-3" key={index}>
                                                      <Card>
                                                            {recipe.image && <Card.Img variant="top" src={recipe.image} alt={recipe.title} />}
                                                            <Card.Body>
                                                                  <Card.Title>{recipe.title}</Card.Title>
                                                            </Card.Body>
                                                      </Card>
                                                </div>
                                          ))
                                    ) : (
                                          <p>No recipes found.</p>
                                    )}
                              </div>
                        </Modal.Body>
                        <Modal.Footer>
                              <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Close
                              </Button>
                              <Button variant="primary" onClick={handleUpload}>
                                    Upload Recipes to Database
                              </Button>
                        </Modal.Footer>
                        {uploadSuccess !== null && (
                              <div className="text-center my-3">
                                    {uploadSuccess ? (
                                          <p className="text-success">Recipes uploaded successfully!</p>
                                    ) : (
                                          <p className="text-danger">Failed to upload recipes.</p>
                                    )}
                              </div>
                        )}
                  </Modal>

                  {/* Global Loading Overlay */}
                  {loading && (
                        <div style={loaderStyle}>
                              <FadeLoader
                                    color={color}
                                    loading={loading}
                                    size={150}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                              />
                        </div>
                  )}
            </div>
      );
};

export default RecipeSearch;
