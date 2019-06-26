const sdk = require('jexia-sdk-js/node');
const config = require('./config/jexia.key.json');
const dataModule = sdk.dataOperations();
/** 
 * IMHO the FetchFunc parameter is very cool, this gives me more flexibility.
 */ 
sdk.jexiaClient().init(config, dataModule);

const listDataSet = async (datasetName) => {
    return dataModule.dataset(datasetName).select().execute()
}

const pushToDataSet = async (datasetName, values) => {
    return dataModule.dataset(datasetName)
        .insert(values) // This method returns an InsertQuery. We can access some info, like 
                        // - RequestExecuter. This object has the configuration passed as jexiaClient().init and other stuff (Need to checkout the docs to understand).
                        // - action (insert in this case), 
                        // - resourceType (ds in this case), 
                        // - resourceName (datasetName value in this case)
                        // - query (Returns a Query object. Nothing useful at this operation)
                        // - body (The 'values' content.)
        //TODO: Can I make any change to the body before execute?
        //TODO: Can I validate RequestExecutor and, for instance, change the config?
        .execute(); //Commit the transaction.
}

const deleteDatasetRecord = async (datasetName, id) => {
    console.log(`Delete record at ${datasetName} dataset with id ${id}`);
    return dataModule.dataset(datasetName)
        .delete()
        .where(sdk.field('id').isEqualTo(id))
        .execute();
}

async function start() {
    const newRecord = await pushToDataSet('Category', { description: 'Category One', active: true });
    console.log('New Record Pushed');
    console.log(newRecord);

    let result = await listDataSet('Category')

    console.log('Records list')
    console.log(result);

    console.log('Now I will delete everything');
    result.map(entity => deleteDatasetRecord('Category', entity.id));

    result = await listDataSet('Category')
    console.log('New records list')
    console.log(result);
}

start();
