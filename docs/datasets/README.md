# Datasets

## Create Dataset

You can create a dataset in the `/dashboard/datasets/create` route or by clicking in `Add Data` in the dashboard 

![Go to create page](./go_to_create.png)

Here you can add all the fields specified in the matadata schema, such as

- Title for the dataset
- URL for the dataset, which is going to act as an ID for the dataset, and act as URL in the public pages such `/datasets/{dataset url}`
- Description for the dataset
- You can also upload the resources and documentation for the datasets in the last step
- And many others

The page looks like this

![New dataset page](./create_dataset.png)

## Edit Dataset

You can edit a dataset by going to `/dashboard/datasets/{dataset url}/edit` or by clicking in the little `Edit` button next to the dataset title in the dashboard list

![Go to edit page](./go_to_edit.png)

The page should look like this, the form is essentially the same as in the create section, with a slightly different styling around + with the values already filled out

![Edit dataset page](./edit.png)

In this edit page, you can also delete the dataset by clicking on the "Delete Button" which should open up a modal for confirmation

![Delete dataset modal](./delete.png)
