import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigwIntegrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as nodelambda from 'aws-cdk-lib/aws-lambda-nodejs';
import type { Construct } from 'constructs';

import ingredientsEnv from '@src/bounded-contexts/ingredients/infrastructure/config/environment';

import { LAMBDA_PATHS } from './config/lambda-paths';

export class RestaurantServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ----------> Tables

    // Orders Table

    const ordersTable = new dynamodb.Table(this, 'OrdersTable', {
      tableName: 'OrdersTable',
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'recipe_id',
        type: dynamodb.AttributeType.STRING,
      },
    });

    // Recipes Table

    const recipesTable = new dynamodb.Table(this, 'RecipesTable', {
      tableName: 'RecipesTable',
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    });

    // Ingredients Table

    const ingredientsTable = new dynamodb.Table(this, 'IngredientsTable', {
      tableName: ingredientsEnv.INGREDIENTS_TABLE_NAME,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    });

    // ----------> Lambdas

    const defaultNodeLambdaProps: nodelambda.NodejsFunctionProps = {
      bundling: {
        minify: false,
        sourceMap: true,
      },
      retryAttempts: 2,
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      environment: {
        ...ingredientsEnv,
        // ...ordersEnv,
        // ...recipesEnv,
      },
    };

    // Orders

    const createOrderLambdaFunction = new nodelambda.NodejsFunction(
      this,
      'CreateOrderLambdaFunction',
      {
        ...defaultNodeLambdaProps,
        functionName: 'CreateOrderLambdaFunction',
        timeout: cdk.Duration.minutes(1),
        entry: LAMBDA_PATHS.orders.createOrder,
      }
    );

    const updateOrderStatusByIdLambdaFunction = new nodelambda.NodejsFunction(
      this,
      'UpdateOrderStatusByIdLambdaFunction',
      {
        ...defaultNodeLambdaProps,
        functionName: 'UpdateOrderStatusByIdLambdaFunction',
        timeout: cdk.Duration.minutes(1),
        entry: LAMBDA_PATHS.orders.updateOrderStatusById,
      }
    );

    const getAllOrdersLambdaFunction = new nodelambda.NodejsFunction(
      this,
      'GetAllOrdersLambdaFunction',
      {
        ...defaultNodeLambdaProps,
        functionName: 'GetAllOrdersLambdaFunction',
        timeout: cdk.Duration.minutes(1),
        entry: LAMBDA_PATHS.orders.getAllOrders,
      }
    );

    const findOrderByIdLambdaFunction = new nodelambda.NodejsFunction(
      this,
      'FindOrderByIdLambdaFunction',
      {
        ...defaultNodeLambdaProps,
        functionName: 'FindOrderByIdLambdaFunction',
        timeout: cdk.Duration.minutes(1),
        entry: LAMBDA_PATHS.orders.findOrderById,
      }
    );

    // Recipes

    const getAllRecipesLambdaFunction = new nodelambda.NodejsFunction(
      this,
      'GetAllRecipesLambdaFunction',
      {
        ...defaultNodeLambdaProps,
        functionName: 'GetAllRecipesLambdaFunction',
        entry: LAMBDA_PATHS.recipes.getAllRecipes,
      }
    );

    const findRecipeByIdLambdaFunction = new nodelambda.NodejsFunction(
      this,
      'FindRecipeByIdLambdaFunction',
      {
        ...defaultNodeLambdaProps,
        functionName: 'FindRecipeByIdLambdaFunction',
        entry: LAMBDA_PATHS.recipes.findRecipeById,
      }
    );

    // Ingredients

    const getAllIngredientsLambdaFunction = new nodelambda.NodejsFunction(
      this,
      'GetAllIngredientsLambdaFunction',
      {
        ...defaultNodeLambdaProps,
        functionName: 'GetAllIngredientsLambdaFunction',
        entry: LAMBDA_PATHS.ingredients.getAllIngredients,
      }
    );

    const findIngredientByIdLambdaFunction = new nodelambda.NodejsFunction(
      this,
      'FindIngredientByIdLambdaFunction',
      {
        ...defaultNodeLambdaProps,
        functionName: 'FindIngredientByIdLambdaFunction',
        entry: LAMBDA_PATHS.ingredients.findIngredientById,
      }
    );

    // ----------> Queues

    // TODO: implement

    // ----------> Event Bus

    // TODO: implement

    // ----------> ApiGW

    const restaurantHttpApigGw = new apigw.HttpApi(
      this,
      'RestaurantHttpApigGw',
      {
        apiName: 'RestaurantHttpApigGw',
        corsPreflight: {
          allowCredentials: true,
          allowMethods: [
            apigw.CorsHttpMethod.POST,
            apigw.CorsHttpMethod.PUT,
            apigw.CorsHttpMethod.PATCH,
            apigw.CorsHttpMethod.GET,
            apigw.CorsHttpMethod.OPTIONS,
          ],
        },
      }
    );

    // Orders

    restaurantHttpApigGw.addRoutes({
      path: '/orders',
      methods: [apigw.HttpMethod.POST],
      integration: new apigwIntegrations.HttpLambdaIntegration(
        'CreateOrderLambdaIntegration',
        createOrderLambdaFunction
      ),
    });

    restaurantHttpApigGw.addRoutes({
      path: '/orders',
      methods: [apigw.HttpMethod.GET],
      integration: new apigwIntegrations.HttpLambdaIntegration(
        'GetAllOrdersLambdaIntegration',
        getAllOrdersLambdaFunction
      ),
    });

    restaurantHttpApigGw.addRoutes({
      path: `/orders/{id}`,
      methods: [apigw.HttpMethod.GET],
      integration: new apigwIntegrations.HttpLambdaIntegration(
        'FindOrderByIdLambdaIntegration',
        findOrderByIdLambdaFunction
      ),
    });

    // Recipes

    restaurantHttpApigGw.addRoutes({
      path: '/recipes',
      methods: [apigw.HttpMethod.GET],
      integration: new apigwIntegrations.HttpLambdaIntegration(
        'GetAllRecipesLambdaIntegration',
        getAllRecipesLambdaFunction
      ),
    });

    restaurantHttpApigGw.addRoutes({
      path: `/recipes/{id}`,
      methods: [apigw.HttpMethod.GET],
      integration: new apigwIntegrations.HttpLambdaIntegration(
        'FindRecipeByIdLambdaIntegration',
        findRecipeByIdLambdaFunction
      ),
    });

    // Ingredients

    restaurantHttpApigGw.addRoutes({
      path: '/ingredients',
      methods: [apigw.HttpMethod.GET],
      integration: new apigwIntegrations.HttpLambdaIntegration(
        'GetAllIngredientsLambdaIntegration',
        getAllIngredientsLambdaFunction
      ),
    });

    restaurantHttpApigGw.addRoutes({
      path: `/ingredients/{id}`,
      methods: [apigw.HttpMethod.GET],
      integration: new apigwIntegrations.HttpLambdaIntegration(
        'FindIngredientByIdLambdaIntegration',
        findIngredientByIdLambdaFunction
      ),
    });

    // ----------> Permissions

    // Order lambdas

    ordersTable.grantReadWriteData(createOrderLambdaFunction);
    recipesTable.grantReadData(createOrderLambdaFunction);
    ordersTable.grantReadData(findOrderByIdLambdaFunction);
    ordersTable.grantReadData(getAllOrdersLambdaFunction);
    ordersTable.grantReadWriteData(updateOrderStatusByIdLambdaFunction);

    // Recipe lambdas

    recipesTable.grantReadData(findRecipeByIdLambdaFunction);
    recipesTable.grantReadData(getAllRecipesLambdaFunction);

    // Ingredient lambdas

    ingredientsTable.grantReadData(findIngredientByIdLambdaFunction);
    ingredientsTable.grantReadData(getAllIngredientsLambdaFunction);
  }
}
