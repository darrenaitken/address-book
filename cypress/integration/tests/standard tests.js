describe("renders the home page", () => {
  it("renders correctly - all contacts appear", () => {
    cy.visit("/");
    cy.get("#MainContent").should("exist");
    cy.get("#results", { delay: 15000 }).find("li").should("have.length", 10);
  });
});

describe("runs searches", () => {
  it("search for name: Eric", () => {
    cy.get("#txtSearch").clear().type("Eric", { delay: 400 });
    cy.findByText("Search Results: 1/10").should("exist");
    cy.get("#results").find("li").contains("Sanders");
  });

  it("search for names containing: an", () => {
    cy.get("#txtSearch").clear().type("an", { delay: 400 });
    cy.findByText("Search Results: 3/10").should("exist");
    cy.get("#results").find("li").should("have.length", 3);
  });

  it("clear search using the escape button", () => {
    cy.get("#txtSearch").type("{esc}");
    cy.findByText("All Contacts (Total: 10)").should("exist");
  });
});

describe("updates contacts", () => {
  it("opens the 'add contact' form", () => {
    cy.get("#btnAddContact").click();
    cy.get("#PopUpDetailsForm").should("be.visible");
  });

  it("closes the 'add contact' form", () => {
    cy.get("#btnClose").click();
    cy.get("#PopUpDetailsForm").should("not.exist");
  });

  it("adds a new contact: Aaron Cumberbatch", () => {
    cy.get("#btnAddContact").click();
    cy.get("#PopUpDetailsForm").should("be.visible");

    cy.get("#txtName").type("Aaron Cumberbatch");
    cy.get("#txtNotes").type("My new best friend :)");
    cy.get("#txtLatitude").type(50.96238);
    cy.get("#txtLongitude").type(-1.42273);

    cy.get("#btnSaveDetails").click();
    cy.findByText("All Contacts (Total: 11)").should("exist");
    cy.get("#results").get(`[id="Aaron Cumberbatch"]`).should("exist");
  });

  it("updates an existing contact: Adam West", () => {
    cy.get("#results").get(`[id="Adam West"]`).should("exist").click();
    cy.get("#PopUpDetailsForm").should("be.visible");
    cy.get("#txtNotes").clear().type("Holy smokes...it's Batman!");
    cy.get("#btnSaveDetails").click();
    cy.get("#results").get(`[id="Adam West"]`).contains("Batman");
  });
});
