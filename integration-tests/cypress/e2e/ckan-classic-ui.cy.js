import {
  createPackageFromUI,
  createResourceFromUI,
  uploadExcelFile,
  uploadPdfFile,
  uploadLargePdfFile,
} from "../support/ckan-classic-ui-tests";

const cypressUpload = require("cypress-file-upload");
const ckanUserName = Cypress.env("CKAN_USERNAME");
const ckanUserPassword = Cypress.env("CKAN_PASSWORD");

Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

describe("CKAN Classic UI", () => {
  beforeEach(function () {
    const getRandomOrganizationName = () => Math.random().toString(36).slice(2) + Cypress.env("ORG_NAME_SUFFIX");
    const organizationName = getRandomOrganizationName();
    cy.wrap(organizationName).as("organizationName");

    cy.consentCookies();
    cy.clearCookies();
    cy.login(ckanUserName, ckanUserPassword);

    cy.get("@organizationName").then((organizationName) => {
      cy.createOrganizationAPI(organizationName);
    });
  });

  afterEach(function () {
    cy.get("@organizationName").then((organizationName) => {
      cy.deleteOrganizationAPI(organizationName);
    });
  });

  createPackageFromUI();
  createResourceFromUI();
  uploadExcelFile();
  uploadPdfFile();
  uploadLargePdfFile();
});
