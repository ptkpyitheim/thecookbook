import React from "react";
import { Card } from "../Card/Card";
import { Header, CardAlign } from "../../styles/styled";
import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import AddRecipe from "./AddRecipe";

class AddPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creatorId: this.props.firebase.currentUserId(),
      recipeList: [],
      userMap: {},
      ingredientList: [],
      allIngredients: {},
    };
  }

  componentDidMount() {
    const userMap = {};
    const users = this.props.firebase.users();
    users.get().then((querySnapshot) => {
      querySnapshot.forEach((userDoc) => {
        let data = userDoc.data();
        userMap[userDoc.id] = {
          cookbook: data.cookbook,
          email: data.email,
          name: data.name,
          friends: data.friends,
        };
      });
      this.setState({ userMap: userMap });
    });

    const recipeList = [];
    const recipes = this.props.firebase.recipes();
    recipes.get().then((querySnapshot) => {
      querySnapshot.forEach((userDoc) => {
        let recipe = {};
        let data = userDoc.data();
        recipe.id = userDoc.id;
        recipe.creatorId = data.creator;
        console.log("title " + data.title);
        recipe.creatorName = this.state.userMap[data.creator].name;
        recipe.difficulty = data.difficulty;
        recipe.ingredients = data.ingredients;
        recipe.instructions = data.instructions;
        recipe.time = data.time;
        recipe.title = data.title;
        recipe.image = data.image;
        recipeList.push(recipe);
      });
      this.setState({ recipeList: recipeList });
    });

    const allIngredients = {};

    const ingredientsList = this.props.firebase.ingredients();
    ingredientsList.get().then((querySnapshot) => {
      querySnapshot.forEach((userDoc) => {
        let data = userDoc.data();
        let ingredientItem = {
          food: data.title,
          image: data.image,
          type: data.type,
        };
        allIngredients[data.title] = ingredientItem;
      });
      this.setState({ allIngredients: allIngredients });
    });
  }

  render() {
    return (
      <AuthUserContext.Consumer>
        {(authUser) => {
          return <AddRecipe allIngredients={this.state.allIngredients} />;
        }}
      </AuthUserContext.Consumer>
    );
  }
}

const condition = (authUser) => !!authUser;

export default compose(withFirebase, withAuthorization(condition))(AddPage);
