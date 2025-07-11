import { resolve } from 'node:path';

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as nodelambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigwIntegrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';

export class RestaurantServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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
      tableName: 'IngredientsTable',
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    });

    // Lambdas

    const defaultNodeLambdaProps: nodelambda.NodejsFunctionProps = {
      bundling: {
        minify: false,
        sourceMap: true,
      },
      retryAttempts: 2,
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      environment: {},
    };

    // --- Orders

    const createOrderLambdaFunction = new nodelambda.NodejsFunction(
      this,
      'CreateOrderLambdaFunction',
      {
        ...defaultNodeLambdaProps,
        functionName: 'CreateOrderLambdaFunction',
        timeout: cdk.Duration.minutes(1),
        entry: resolve(''),
      }
    );

    const updateOrderLambdaFunction = new nodelambda.NodejsFunction(
      this,
      'UpdateOrderLambdaFunction',
      {
        ...defaultNodeLambdaProps,
        functionName: 'UpdateOrderLambdaFunction',
        timeout: cdk.Duration.minutes(1),
        entry: resolve(''),
      }
    );

    // --- Recipes

    const getAllRecipesLambdaFunction = new nodelambda.NodejsFunction(
      this,
      'GetAllRecipesLambdaFunction',
      {
        ...defaultNodeLambdaProps,
        functionName: 'GetAllRecipesLambdaFunction',
        entry: resolve(''),
      }
    );

    const findRecipeByIdLambdaFunction = new nodelambda.NodejsFunction(
      this,
      'FindRecipeByIdLambdaFunction',
      {
        ...defaultNodeLambdaProps,
        functionName: 'FindRecipeByIdLambdaFunction',
        entry: resolve(''),
      }
    );

    // --- Ingredients

    const getAllIngredientsLambdaFunction = new nodelambda.NodejsFunction(
      this,
      'GetAllIngredientsLambdaFunction',
      {
        ...defaultNodeLambdaProps,
        functionName: 'GetAllIngredientsLambdaFunction',
        entry: resolve(''),
      }
    );

    const findIngredientByIdLambdaFunction = new nodelambda.NodejsFunction(
      this,
      'FindIngredientByIdLambdaFunction',
      {
        ...defaultNodeLambdaProps,
        functionName: 'FindIngredientByIdLambdaFunction',
        entry: resolve(''),
      }
    );

    // Queues

    // --- Orders

    const createOrderDlqQueueFifo = new sqs.Queue(
      this,
      'createOrderDlqQueue.fifo',
      {
        queueName: 'CreateOrderDlqQueueFifo.fifo',
        fifo: true,
        retentionPeriod: cdk.Duration.days(3),
      }
    );

    const createOrderQueueFifo = new sqs.Queue(this, 'CreateOrderQueueFifo', {
      queueName: 'CreateOrderQueue.fifo',
      contentBasedDeduplication: false,
      fifo: true,
      deduplicationScope: sqs.DeduplicationScope.MESSAGE_GROUP,
      retentionPeriod: cdk.Duration.days(1),
      visibilityTimeout: cdk.Duration.minutes(3),
      deadLetterQueue: {
        maxReceiveCount: 3,
        queue: createOrderDlqQueueFifo,
      },
    });

    const orderStatusDlqQueueFifo = new sqs.Queue(
      this,
      'OrderStatusDlqQueueFifo',
      {
        queueName: 'OrderStatusDlqQueue.fifo',
        fifo: true,
        retentionPeriod: cdk.Duration.days(3),
      }
    );

    const orderStatusQueueFifo = new sqs.Queue(this, 'OrderStatusQueueFifo', {
      queueName: 'OrderStatusQueue.fifo',
      contentBasedDeduplication: false,
      fifo: true,
      deduplicationScope: sqs.DeduplicationScope.MESSAGE_GROUP,
      retentionPeriod: cdk.Duration.days(1),
      visibilityTimeout: cdk.Duration.minutes(3),
      deadLetterQueue: {
        maxReceiveCount: 3,
        queue: orderStatusDlqQueueFifo,
      },
    });

    // Event Bus

    const eventBus = new events.EventBus(this, 'RestaurantEventBus', {
      eventBusName: 'RestaurantEventBus',
    });

    // Event rules

    // --- Orders

    const orderCreatedRule = new events.Rule(this, 'OrderCreatedRule', {
      eventBus,
      enabled: true,
      description: 'Evento cuando una orden es creada',
      ruleName: 'OrderCreatedRule',
      eventPattern: {
        source: ['restaurant.orders'],
        detailType: ['order.created'],
        detail: {
          status: 'PENDING',
        },
      },
      targets: [new targets.LambdaFunction(createOrderLambdaFunction)],
    });

    const orderStatusUpdatedRule = new events.Rule(
      this,
      'OrderStatusUpdatedRule',
      {
        eventBus,
        enabled: true,
        description: 'Evento cuando el estado de una orden es actualizado',
        ruleName: 'OrderStatusUpdatedRule',
        eventPattern: {
          source: ['restaurant.orders'],
          detailType: ['order.updated'],
        },
        targets: [new targets.LambdaFunction(updateOrderLambdaFunction)],
      }
    );

    // ApiGW

    const restaurantHttpApigGw = new apigw.HttpApi(this, 'HttpApiGw', {
      apiName: 'RestaurantHttpApigGw',
      corsPreflight: {
        allowCredentials: true,
        allowOrigins: ['*'],
        allowMethods: [
          apigw.CorsHttpMethod.POST,
          apigw.CorsHttpMethod.PUT,
          apigw.CorsHttpMethod.PATCH,
          apigw.CorsHttpMethod.GET,
          apigw.CorsHttpMethod.OPTIONS,
        ],
      },
    });

    // --- Orders

    restaurantHttpApigGw.addRoutes({
      path: '/orders',
      methods: [apigw.HttpMethod.POST],
      integration: new apigwIntegrations.HttpSqsIntegration(
        'CreateOrderSqsIntegration',
        {
          queue: createOrderQueueFifo,
        }
      ),
    });

    restaurantHttpApigGw.addRoutes({
      path: '/orders',
      methods: [apigw.HttpMethod.GET],
      integration: new apigwIntegrations.HttpLambdaIntegration(
        'GetAllOrdersLambdaIntegration',
        createOrderLambdaFunction
      ),
    });

    // --- Recipes

    restaurantHttpApigGw.addRoutes({
      path: '/recipes/{recipeId}',
      methods: [apigw.HttpMethod.GET],
      integration: new apigwIntegrations.HttpLambdaIntegration(
        'FindRecipeById',
        findRecipeByIdLambdaFunction
      ),
    });

    restaurantHttpApigGw.addRoutes({
      path: '/recipes',
      methods: [apigw.HttpMethod.GET],
      integration: new apigwIntegrations.HttpLambdaIntegration(
        'GetAllRecipes',
        getAllRecipesLambdaFunction
      ),
    });

    // --- Ingredients

    restaurantHttpApigGw.addRoutes({
      path: '/ingredients/{ingredientId}',
      methods: [apigw.HttpMethod.GET],
      integration: new apigwIntegrations.HttpLambdaIntegration(
        'FindOrderById',
        findIngredientByIdLambdaFunction
      ),
    });

    restaurantHttpApigGw.addRoutes({
      path: '/ingredients',
      methods: [apigw.HttpMethod.GET],
      integration: new apigwIntegrations.HttpLambdaIntegration(
        'GetAllIngredients',
        getAllIngredientsLambdaFunction
      ),
    });

    // Permissions

    // --- Orders

    createOrderLambdaFunction.addEventSource(
      new lambdaEventSources.SqsEventSource(createOrderQueueFifo, {
        batchSize: 10,
        maxConcurrency: 5,
        reportBatchItemFailures: true,
      })
    );
    ordersTable.grantReadWriteData(createOrderLambdaFunction);
    recipesTable.grantReadData(createOrderLambdaFunction);
    eventBus.grantPutEventsTo(createOrderLambdaFunction);

    updateOrderLambdaFunction.addEventSource(
      new lambdaEventSources.SqsEventSource(orderStatusQueueFifo, {
        batchSize: 10,
        maxConcurrency: 5,
        reportBatchItemFailures: true,
      })
    );
    ordersTable.grantReadWriteData(updateOrderLambdaFunction);
    eventBus.grantPutEventsTo(createOrderLambdaFunction);
  }
}
