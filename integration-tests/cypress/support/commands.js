// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

require("@4tw/cypress-drag-drop");

import "cypress-axe";

const cypressUpload = require("cypress-file-upload");
const headers = {
  Authorization: Cypress.env("API_KEY"),
  "Content-Type": "application/json",
};

const getRandomDatasetName = () =>
  Math.random().toString(36).slice(2) + Cypress.env("DATASET_NAME_SUFFIX");
const getRandomOrganizationName = () =>
  Math.random().toString(36).slice(2) + Cypress.env("ORG_NAME_SUFFIX");
const getRandomGroupName = () =>
  Math.random().toString(36).slice(2) + Cypress.env("GROUP_NAME_SUFFIX");

const apiUrl = (path) => {
  return `${Cypress.config("baseUrl")}/api/3/action/${path}`;
};

function printAccessibilityViolations(violations) {
  cy.task(
    "table",
    violations.map(({ id, impact, description, nodes }) => ({
      impact,
      description: `${description} (${id})`,
      nodes: nodes.map((el) => el.target).join(" / "),
    }))
  );
}

Cypress.Commands.add(
  "checkAccessibility",
  {
    prevSubject: "optional",
  },
  ({ skipFailures = false, context = null, options = null } = {}) => {
    //  By default, exclude CKAN debugger elements
    const defaultContext = {
      exclude: [
        [".flDebugTimerPanel"],
        [".flDebugTemplatePanel"],
        [".flDebugLoggingPanel"],
        [".flDebugRouteListPanel"],
        [".flDebugProfilerPanel"],
        [".flDebugSQLAlchemyPanel"],
        ["#flDebugToolbar"],
        [".debug"],
      ],
    };

    if (!context) {
      context = defaultContext;
    } else {
      context = { ...defaultContext, ...context };
    }

    cy.checkA11y(
      context,
      {
        ...options,
        runOnly: {
          type: "tag",
          values: ["wcag2aa", "wcag2a", "wcag***"],
        },
      },
      printAccessibilityViolations,
      skipFailures
    );
  }
);

Cypress.Commands.add("login", (email, password) => {
  cy.session([email, password], () => {
    cy.visit({ url: "/user/_logout" }).then(() => {
      cy.visit({ url: "/user/login" }).then((resp) => {
        cy.get("#field-login").type(email);
        cy.get("#field-password").type(password);
        cy.get("#field-remember").check();
        cy.get(".form-actions > .btn").click({ force: true });
      });
    });
  });
});

Cypress.Commands.add("consentCookies", (name) => {
  window.localStorage.setItem("uc_user_interaction", "true");
  window.localStorage.setItem("uc_ui_version", "3.31.0");
  window.localStorage.setItem(
    "uc_settings",
    '{"controllerId":"be35644e53624f168a34831b6b8f43fd0f00c7a7046149f4a71ae4dd4fe7c086","id":"-Ng55cVGIeHhNq","language":"en","services":[{"history":[{"action":"onInitialPageLoad","language":"en","status":true,"timestamp":1697590963232,"type":"implicit","versions":{"application":"SDK-4.28.2","service":"40.17.42","settings":"2.0.0"}},{"action":"onAcceptAllServices","language":"en","status":true,"timestamp":1697590987880,"type":"explicit","versions":{"application":"SDK-4.28.2","service":"40.17.42","settings":"2.0.0"}}],"id":"H1Vl5NidjWX","processorId":"714588f7c59602d69ea5b0377f9daf339519d550a31e9ca46d5218d838da87b9","status":true},{"history":[{"action":"onInitialPageLoad","language":"en","status":true,"timestamp":1697590963232,"type":"implicit","versions":{"application":"SDK-4.28.2","service":"25.7.28","settings":"2.0.0"}},{"action":"onAcceptAllServices","language":"en","status":true,"timestamp":1697590987880,"type":"explicit","versions":{"application":"SDK-4.28.2","service":"25.7.28","settings":"2.0.0"}}],"id":"BJ59EidsWQ","processorId":"5291d30c403cf10e79a3195537dfda599da1125698410838ad7a451697b7b740","status":true}],"version":"2.0.0"}'
  );
  window.sessionStorage.setItem(
    "uc_user_country",
    '{"countryCode":"BR","countryName":"BR","regionCode":"RN"}'
  );
});

Cypress.Commands.add("createDatasetWithoutFile", (name) => {
  cy.visit({ url: "/dataset" }).then((resp) => {
    const datasetName = name || getRandomDatasetName();
    cy.get(".page_primary_action > .btn").click();
    cy.get("#field-title").type(datasetName);
    cy.get("#field-author").type("Datopian");
    cy.get("#field-author-email").type("datopian@datopian.com");
    cy.get("#field-maintainer").type("Datopian");
    cy.get("#field-maintainer-email").type("datopian@datopian.com");
    cy.get(".btn-xs").click();
    cy.get("#field-name").clear().type(datasetName);
    cy.get('[name="save"]').click({ force: true });
    cy.wrap(datasetName);
  });
});

Cypress.Commands.add("createDataset", (dataset = false, private_vis = true) => {
  let datasetName = dataset;
  let is_private = private_vis;
  cy.visit({ url: "/dataset" }).then((resp) => {
    if (!datasetName) {
      datasetName = getRandomDatasetName();
    }
    cy.get(".page_primary_action > .btn").click();
    cy.get("#field-title").type(datasetName);
    cy.get(".btn-xs").click();
    cy.get("#field-name").clear().type(datasetName);
    if (!is_private) {
      cy.get("#field-private").select("False");
    }
    cy.get("#field-author").type("Datopian");
    cy.get("#field-author-email").type("datopian@datopian.com");
    cy.get("#field-maintainer").type("Datopian");
    cy.get("#field-maintainer-email").type("datopian@datopian.com");
    cy.get('[name="save"]').click({ force: true });
    cy.get("#field-resource-upload").attachFile({
      filePath: "sample.csv",
      fileName: "sample.csv",
    });
    cy.get('[value="go-metadata"]').click({ force: true });
    cy.get(".content_action > .btn");
    cy.wrap(datasetName);
  });
});

Cypress.Commands.add("createLinkedDataset", () => {
  cy.visit({ url: "/dataset" }).then((resp) => {
    const datasetName = getRandomDatasetName();
    cy.get(".page_primary_action > .btn").click();
    cy.get("#field-title").type(datasetName);
    cy.get(".btn-xs").click();
    cy.get("#field-name").clear().type(datasetName);
    cy.get("button.btn-primary[type=submit]").click({ force: true });
    cy.get(
      '[title="Link to a URL on the internet (you can also link to an API)"]'
    ).click();
    cy.get("#field-image-url")
      .clear()
      .type(
        "https://raw.githubusercontent.com/datapackage-examples/sample-csv/master/sample.csv"
      );
    cy.get(".btn-primary").click();
    cy.get(".content_action > .btn");
    cy.wrap(datasetName);
  });
});

Cypress.Commands.add("updatePackageMetadata", (datasetName) => {
  const request = cy.request({
    method: "POST",
    url: apiUrl("package_patch"),
    headers: headers,
    body: {
      id: datasetName,
      notes: "Update notes",
    },
  });
});

Cypress.Commands.add("updateResourceMetadata", (datasetName) => {
  const request = cy.request({
    method: "POST",
    url: apiUrl("resource_patch"),
    headers: headers,
    body: {
      id: datasetName,
      description: "Update description",
    },
  });
});

Cypress.Commands.add("deleteDataset", (datasetName) => {
  cy.visit({ url: "/dataset/delete/" + datasetName }).then(() => {
    cy.get("form#confirm-dataset-delete-form > .btn-primary").click();
    cy.contains("Dataset has been deleted.");
  });
});

Cypress.Commands.add("deleteReport", (reportName) => {
  cy.visit({ url: "/report" }).then(() => {
    cy.contains(reportName).parents(".content-box").within(() => {
      cy.get(".btn").contains("Delete").click({ force: true });
    });
    cy.get('body').then($body => {
      if ($body.find('.modal-footer > .btn-primary:contains("Confirm")').length > 0) {
        cy.get('.modal-footer > .btn-primary').contains("Confirm").click();
      } else {
        cy.log('No modal present, proceeding without confirmation.');
      }
    });

    cy.contains("Report and visualizations were removed successfully.").should('be.visible');
  });
});

Cypress.Commands.add("purgeDataset", (datasetName) => {
  const request = cy.request({
    method: "POST",
    url: apiUrl("dataset_purge"),
    headers: headers,
    body: {
      id: datasetName,
    },
  });
});

Cypress.Commands.add("createOrganization", () => {
  const organizationName = getRandomOrganizationName();
  cy.get(".nav > :nth-child(2) > a").first().click();
  cy.get(".page_primary_action > .btn").click();
  cy.get("#field-title").type(organizationName, { force: true });
  cy.get(".btn-xs").click({ force: true });
  cy.get("#field-name").clear().type(organizationName);
  cy.get('[name="save"]').click({ force: true });
  cy.location("pathname").should("eq", "/organization/" + organizationName);
});

Cypress.Commands.add(
  "createGroup",
  (groupName, relationshipType, relationships) => {
    if (!groupName) {
      groupName = getRandomGroupName();
    }

    cy.visit("/group/new");
    cy.wait(2000);
    cy.get("#field-name").type(groupName);
    cy.get("#field-description").type(`Description for ${groupName}`);
    cy.get("#field-additional_description").type(
      `Additional description for ${groupName}`
    );

    if (relationshipType) {
      cy.get("#group_relationship_type").select(relationshipType);

      if (relationships) {
        if (relationshipType === "parent") {
          for (let i = 0; i < relationships.length; i++) {
            cy.get("#s2id_field-children").within(() => {
                cy.get(".select2-input").type(relationships[i], { force: true });
                cy.wait(1000);
                cy.get(".select2-input").type("{enter}", { force: true });
            });
          }
        } else if (relationshipType === "child") {
          cy.get("#field-parent").select(relationships);
        }
      }
    }

    cy.get(".btn-primary").contains("Save Group").click({ force: true });
  }
);

Cypress.Commands.add("deleteGroup", (groupName) => {
  cy.visit(`/group/edit/${groupName}`);

  cy.get(".btn-danger").contains("Delete").click();
  cy.get(".btn-primary").contains("Confirm").click();
});

Cypress.Commands.add("deleteOrganization", (orgName) => {
  cy.visit({ url: "/organization/" + orgName }).then(() => {
    cy.get(".content_action > .btn").click();
    cy.get(".form-actions > .btn-danger").click();
    cy.get(".btn-primary").click();
    cy.contains("Organization has been deleted.");
  });
});

Cypress.Commands.add("purgeOrganization", (orgName) => {
  const request = cy.request({
    method: "POST",
    url: apiUrl("organization_purge"),
    headers: headers,
    body: {
      id: orgName,
    },
  });
});

// Command for frontend test sepecific
Cypress.Commands.add("createOrganizationAPI", (name) => {
  cy.request({
    method: "POST",
    url: apiUrl("organization_create"),
    headers: headers,
    body: {
      name: name,
      description: "Some organization description",
    },
  });
});

Cypress.Commands.add("getReportData", (name) => {
  cy.request({
    url: apiUrl("querytool_get") + `?name=${name}`,
    headers: headers,
  });
});

Cypress.Commands.add("getReportVizData", (name) => {
  cy.request({
    url: apiUrl("querytool_get_visualizations") + `?name=${name}`,
    headers: headers,
    timeout: 30000,
    retryOnNetworkFailure: true,
  });
});

Cypress.Commands.add("deleteOrganizationAPI", (name) => {
  cy.request({
    method: "POST",
    url: apiUrl("organization_delete"),
    headers: headers,
    body: { id: name },
  });
});

Cypress.Commands.add("createGroupAPI", (name, relationshipType, relationships) => {
  const body = {
    name: name,
    description: "Some group description",
    additional_description: "Some additional group description",
    group_relationship_type: "",
    parent: "",
    children: ""
  };

  if (relationshipType) {
    body.group_relationship_type = relationshipType;
  }
  if (relationships) {
    if (relationshipType === "parent") {
      body.children = relationships.join(",");
    } else if (relationshipType === "child") {
      body.parent = relationships;
    }
  }
  cy.request({
    method: "POST",
    url: apiUrl("group_create"),
    headers: headers,
    body: body,
  });
});

Cypress.Commands.add("deleteGroupAPI", (name) => {
  cy.request({
    method: "POST",
    url: apiUrl("group_delete"),
    headers: headers,
    body: { id: name },
  });
});

Cypress.Commands.add("createDatasetAPI", (organization, name, otherFields) => {
  const request = cy.request({
    method: "POST",
    url: apiUrl("package_create"),
    headers: headers,
    body: {
      owner_org: organization,
      name: name,
      author: "csv",
      author_email: "datopian@datopian.com",
      maintainer: "datopian",
      maintainer_email: "datopian@datopian.com",
      url: "Source not specified",
      license_id: "notspecified",
      ...otherFields,
    },
  });
});

Cypress.Commands.add("datapusherSubmitAPI", (resourceId) => {
  const request = cy.request({
    method: "POST",
    url: apiUrl("datapusher_submit"),
    headers: headers,
    body: {
      resource_id: resourceId,
    },
  });
});

Cypress.Commands.add("datastoreSearchAPI", (resourceId) => {
  const request = cy.request({
    method: "POST",
    url: apiUrl("datastore_search"),
    headers: headers,
    body: {
      resource_id: resourceId,
    },
    failOnStatusCode: false
  }).then((res) => {
    if (res.status === 200) {
      return true;
    } else if (res.status === 404) {
      return false;
    } else {
      throw new Error("Unexpected status code: " + res.status);
    }
  });
});

Cypress.Commands.add("createResourceAPI", (dataset, resource) => {
  const request = cy.request({
    method: "POST",
    url: apiUrl("datastore_create"),
    headers: headers,
    body: {
      resource: {
        package_id: dataset,
        name: resource,
        format: "CSV",
      },
      records: [
        {
          name: " Jhon Mayer",
          age: 29,
        },
      ],
      force: "True",
    },
  });
});

Cypress.Commands.add("updateResourceRecord", (resource) => {
  const request = cy.request({
    method: "POST",
    url: apiUrl("datastore_upsert"),
    headers: headers,
    body: {
      resource_id: resource,
      records: [
        {
          name: "Jhon lenon",
          age: 60,
        },
      ],
      method: "insert",
      force: true,
    },
  });
});

Cypress.Commands.add("deleteDatasetAPI", (name) => {
  const request = cy.request({
    method: "POST",
    url: apiUrl("package_delete"),
    headers: headers,
    body: {
      id: name,
    },
  });
});

Cypress.Commands.add("datasetCount", (name) => {
  return cy
    .request({
      method: "GET",
      url: apiUrl("package_search"),
      headers: headers,
      body: {
        rows: 1,
      },
    })
    .then((res) => {
      return res.body.result.count;
    });
});

Cypress.Commands.add("groupCount", (name) => {
  return cy
    .request({
      method: "GET",
      url: apiUrl("organization_list"),
      headers: headers,
    })
    .then((res) => {
      return res.body.result.length;
    });
});

Cypress.Commands.add("facetFilter", (facetType, facetValue) => {
  return cy
    .request({
      method: "GET",
      url: apiUrl("package_search"),
      headers: headers,
      qs: {
        fq: `${facetType}:${facetValue}`,
      },
    })
    .then((res) => {
      return res.body.result.count;
    });
});

Cypress.Commands.add("prepareFile", (dataset, file, format, resourceId = null, resourceName = file, resourceDescription = "Lorem Ipsum is simply dummy text of the printing and type") => {
  cy.fixture(`${file}`, "binary")
    .then(Cypress.Blob.binaryStringToBlob)
    .then((blob) => {
      var data = new FormData();
      data.append("package_id", dataset);
      data.append("name", resourceName);
      data.append("format", format);
      data.append("description", resourceDescription);
      data.append("upload", blob, file);

      if (resourceId) {
        data.append("id", resourceId);
      }

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open("POST", apiUrl("resource_create"));
      xhr.setRequestHeader("Authorization", headers.Authorization);
      xhr.send(data);
    });
});

Cypress.Commands.add("datasetMetadata", (dataset) => {
  return cy
    .request({
      method: "GET",
      url: apiUrl("package_show"),
      headers: headers,
      qs: {
        id: dataset,
      },
    })
    .then((res) => {
      return res.body.result;
    });
});

Cypress.Commands.add("iframe", { prevSubject: "element" }, ($iframe) => {
  const $iframeDoc = $iframe.contents();
  const findBody = () => $iframeDoc.find("body");
  if ($iframeDoc.prop("readyState") === "complete") return findBody();
  return Cypress.Promise((resolve) =>
    $iframe.on("load", () => resolve(findBody()))
  );
});
