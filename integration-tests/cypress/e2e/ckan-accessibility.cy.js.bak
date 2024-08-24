const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanPassword = Cypress.env("CKAN_PASSWORD");

const pages = require('../../routes.json')

const organizationName =
  Math.random().toString(36).slice(2) + Cypress.env("ORG_NAME_SUFFIX");
const datasetName =
  Math.random().toString(36).slice(2) + Cypress.env("DATASET_NAME_SUFFIX");
const resourceName =
  Math.random().toString(36).slice(2) + Cypress.env("RESOURCE_NAME_SUFFIX");
const groupName =
  Math.random().toString(36).slice(2) + Cypress.env("GROUP_NAME_SUFFIX");


const replacements = {
  user: {
    id: ckanUserName,
  },
  organization: {
    id: organizationName,
  },
  dataset: {
    id: datasetName,
    resource_id: "<resource_id>"
  },
  group: {
    id: groupName,
  },
};

const replaceParams = (route) => {
  const roots = Object.keys(replacements);

  const routeParts = route.split("/");
  if (routeParts.length > 1 && roots.includes(routeParts[1])) {
    const replacementObj = replacements[routeParts[1]];
    Object.keys(replacementObj).forEach((k) => {
      route = route.replace(`<${k}>`, replacementObj[k]);
    });
  }

  return route;
};

describe("Pages meet the accessibility requirements onload ", () => {
  before(function () {
    cy.createOrganizationAPI(organizationName);
    cy.createDatasetAPI(organizationName, datasetName, true);
    cy.createResourceAPI(datasetName, resourceName);
    cy.createGroupAPI(groupName);
    cy.login(ckanUserName, ckanPassword)
    cy.consentCookies();

    cy.visit(`/dataset/resources/${datasetName}`);
    cy.get('.resource-item a').invoke('attr', 'href').then(href => {
      replacements.dataset.resource_id = href.split('/').at(-2);
    })

  });

  beforeEach(() => {
    cy.login(ckanUserName, ckanPassword)
    cy.consentCookies()
  });

  let i = 0;
  let max = 1;

  pages.forEach((page) => {
    it(`${replaceParams(page)}`, () => {
      cy.visit(replaceParams(page), { timeout: 30000 });
      if(page.includes("edit")) {
        cy.wait(5000)
      }
      cy.injectAxe();
      cy.checkAccessibility();
    });
  });

  after(() => {
    cy.deleteDatasetAPI(datasetName);
    cy.deleteOrganizationAPI(organizationName);
    cy.deleteGroupAPI(groupName);
  });
});
