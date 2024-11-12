<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [ORGANIZATIONS](#organizations)
  - [Create Organization](#create-organization)
  - [Edit Organization](#edit-organization)
  - [Organization Member Management](#organization-member-management)
  - [List and Search Organizations](#list-and-search-organizations)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# ORGANIZATIONS

## Create Organization

You can create a organization in the `/dashboard/organizations/create` route where you can define. Only sysadmin user can create an organization.

- Title for the organization
- URL for the organization, which is going to act as an ID for the organization, and act as URL in the public pages such `/organizations/{organization url}`
- Description for the organization
- You can also upload an image to act as a logo or featured image for the organization
- You can also define a parent for the organization, which is going to be another organization and is going to decide the place of that organization inside the hierarchy

The page looks like this

![New organization page](./create.png)

## Edit Organization

You can edit a organization by going to `/dashboard/organizations/{organization url}/edit`

![Edit organization page](./edit.png)

In this edit page, you can also delete by clicking on the "Delete Button" which should open up a modal for confirmation

![Delete organization modal](./delete.png)

## Organization Member Management

You can edit an organization members in the `/dashboard/organizations/{organization url}/members` or by clicking on 'Members' in the edit page

![Members management](./members.png)

To add a new member, simply click on "Add another member", select the user and their capacity, and then click "Save" (you can also edit any existing members, or remove them by clicking on the small red `-` button on the right)

![Members management addition](./members-add.png)

Note that if the user you want to invite doesn't have a portal account yet, you can simply type the user's email address in the input and click add. This will send an email to the new portal user with an invitation link to join the portal, and upon accepting the invitation by clicking the link and signing up with GitHub, the user will already be a member of the organization to which he was initially added.

## List and Search Organizations
To view the Organizations list, you can go to `/dashboard/organizations`.
Sysadmin users can view all organizations.

Other users can view organizations that they belong to being able to click on the organization to edit it if they are 'admin' of the organization.

![List Organization](list.png)

You can search for Organizations based on their name, title and description.

![Search Organizationss](search.png)

Clicking on an organization will redirect you to Edit Organization Page.

