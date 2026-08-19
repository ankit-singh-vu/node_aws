aws dynamodb create-table `
    --table-name Todos `
    --attribute-definitions AttributeName=id,AttributeType=S `
    --key-schema AttributeName=id,KeyType=HASH `
    --billing-mode PAY_PER_REQUEST `
    --region ap-south-1
    