import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
:root {

  --color-button-text-light: #2e4d36;  /* Textfarbe im Lightmode */
  --color-button-text-dark: #ffffff;  /* Textfarbe im Darkmode */

  --color-background: #f0f5f1; 
  --color-text-primary: #2e4d36; 

  --color-background-cards: #ffffff; 

  --color-button-text: #ffffff; 
  --color-button-border: #b5cbb7; 

  --color-button-background: #5b8a72; 
  --color-button-hover-background: #4a725c; 

  --color-button-save: #4caf50;
  --color-button-save-hover: #3e8e41; 

  --color-button-cancel: #b58362; 
  --color-button-cancel-hover: #a17450; 

  --color-button-delete: #e53935; 
  --color-button-delete-hover: #c62828;

  --color-button-favourite: #d2a85d; 
  --color-button-favourite-hover: #b5884b; 

  --color-button-add: #4a725c;
  --color-button-add-hover: #3c5b4a; 

  --color-button-edit: #c07a2f;
  --color-button-edit-hover: #b5884b; 

  --color-link-see-more: #6c8f5c;
  --color-link-see-more-hover: #597547;

  --color-button-filter: #4a725c; 
  --color-button-filter-tag: #3c5b4a; 
  --color-button-filter-hover: #3c5b4a; 

  --color-label: #555;

  --border-radius: 8px;
  --box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  --header-font-size: 2rem;
  --header-font-weight: 600;
  --header-color: #2e4d36; 
  --header-margin: 20px 0;
  --header-text-align: center;

  --color-footer-background: #6b8a3f;
}


  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: system-ui;
    background-color: ${(props) => (props.darkMode ? "#121212" : "#fff")};
    color: ${(props) => (props.darkMode ? "#fff" : "#000")};
    transition: background-color 0.3s ease, color 0.3s ease;

  }


  main {
    padding-bottom: 90px;
    font-family: "Nunito", sans-serif;
  }

 button {
  font-size: 1rem;
  color: ${(props) =>
    props.darkMode
      ? "var(--color-button-text-dark)"
      : "var(--color-button-text-light)"};
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: "Junge", sans-serif;
}


  article {
    background-color: var(--color-background-cards); 
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    position: relative;   
  }

  form {
    background-color: var(--color-background-cards);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    padding: 20px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (min-width: 720px) {
      width: 50%; 
      margin: 20px auto 0 auto;
    }
  }


  img {
    border-radius: 50%;
  }

  hr {
  border: none;
  height: 1px;
  background-color: var(--color-button-border); 
  width: 66.66%; 
  margin: 15px auto;
}

  header {
    font-size: var(--header-font-size);
    font-weight: var(--header-font-weight);
    color: var(--header-color);
    margin: var(--header-margin);
    text-align: var(--header-text-align);
    font-weight: bold;
    font-family: "Playfair Display", sans-serif;
  }

    h1{
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    color: var(--color-text-primary);
  }

  h2 {
    font-size: 1.3rem;
    color: var(--color-text-primary);
    display: flex;
    justify-content: center;
  }

  h3 {
    font-size: 1.1rem;
    display: flex;
    justify-content: center;
    color: var(--color-text-primary);
  }

  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: var(--color-footer-background);
    display: flex;
    justify-content: space-around;
  }

  ul {
  list-style: none;

  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;

    @media (min-width: 720px) {
    grid-template-columns: repeat(3, 1fr);
  }
  }

  label {
    display: flex;
    gap: 5px;
    font-size: 0.95rem;
    color: var(--color-text-primary);
  }

  input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #007bff;
      outline: none;
    }
  }

  textarea {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    resize: none;

    &:focus {
      border-color: #007bff;
      outline: none;
    }
  }

  fieldset {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
  }

  legend {
    font-size: 1rem;
    color: var(--color-text-primary);
    padding: 0 5px;
  }

`;
