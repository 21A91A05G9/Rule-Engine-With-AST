# Rule Engine with AST

## Project Overview
The Rule Engine with Abstract Syntax Tree (AST) is a 3-tier application designed to determine user eligibility based on various attributes such as age, department, income, and spending. By representing conditional rules as ASTs, the system allows for dynamic creation, combination, and modification of rules, providing flexibility in eligibility assessments.

## Features
- **Dynamic Rule Creation**: Users can create eligibility rules using a user-friendly interface.
- **Rule Combination**: Multiple rules can be combined into a single logical structure, allowing for complex eligibility checks.
- **Rule Evaluation**: The engine evaluates rules against user data to determine eligibility.
- **Error Handling**: The application includes robust error handling for invalid rule strings and data formats.
- **Modifiable Rules**: Users can modify existing rules, enhancing adaptability.
- **User-Defined Functions**: Future extensions may support advanced conditions through user-defined functions.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Testing**: Jest or Mocha/Chai

## Project Structure
rule-engine/ ├── backend/ # Backend code │ ├── controllers/ # API controllers │ ├── models/ # Database models │ ├── routes/ # API routes │ ├── services/ # Business logic │ ├── utils/ # Utility functions │ ├── .env # Environment variables │ ├── package.json # Backend dependencies │ └── server.js # Backend entry point ├── frontend/ # Frontend code │ ├── public/ # Public assets │ ├── src/ # React components and logic │ ├── package.json # Frontend dependencies │ └── .env # Frontend environment variables └── README.md # Project documentation


## How to Start

### Frontend Setup
1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd rule-engine

2. **Navigate to the Frontend Directory**
   ```bash
   npm install

3. **Install Dependencie**
   ```bash
   cd client

3. **Start the Frontend Application**
   ```bash
   npm start

### Backend Setup
1. **Navigate to the Backend Directory**
   ```bash
   cd ../backend

2. **Install Dependencies**
   ```bash
   npm install

4. **Set Up Environment Variables Create a .env file in the backend directory with the following content:**
    ```bash
    MONGODB_URI=mongodb://localhost:27017/rule_engine
   PORT=5000


5. **Start the Backend Application**
   ```bash
   npm start


## How to Use
- **Creating Rules: Access the frontend application and use the provided form to input rule strings. After submission, the application will generate and store the corresponding AST.
- **Combining Rules: Select multiple rules from the frontend to combine them, and the resulting AST will be displayed.
- **Evaluating Rules: Provide user data to evaluate against the created or combined rules, and the application will display whether the user meets the eligibility criteria.

## API Endpoints
1. Create Rule
- **Endpoint: POST /api/rules
- **Description: Create a new rule and store it in the database.
- **Request Body
  ```bash
  {
  "ruleString": "your_rule_string"
  }
- **Response
  ```bash
  {
  "message": "Rule created successfully",
  "ast": "<AST_representation>"
   }

2. Combine Rules
- **Endpoint: POST /api/rules/combine
- **Description: Combine multiple rules into a single AST.
- **Request Body:
  ```bash
  {
   "rules": ["rule1_string", "rule2_string"]
  }
- **Response
   ```bash
   {
     "combinedAst": "<combined_AST_representation>"
   }

3. Evaluate Rule
- **Endpoint: POST /api/rules/evaluate
- **Description: Evaluate a rule against provided user attributes.
- **Request Body:
    ```bash
   {
     "ast": "<AST>",
     "data": {
       "age": 30,
       "department": "Sales",
       "salary": 60000,
       "experience": 3
     }
   }
- **Response:
    ```bash
   {
     "result": true
   }

## Bonus Features
- **Error Handling: Implement error responses for invalid rule strings and incorrect data formats (e.g., missing operators, invalid comparisons).
- **Attribute Validation: Ensure provided attributes match a predefined catalog.
- **Rule Modification: Allow users to modify existing rules, changing operators, operand values, or adding/removing sub-expressions within the AST.
- **User-Defined Functions: Extend the system to support user-defined functions for advanced conditions in future versions.

