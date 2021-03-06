import {
  createAndLoginStudent,
  createAndLoginTA,
  checkInTA,
  createQueue,
} from "../../utils";

describe("Allow or disable new questions for a queue", () => {
  beforeEach(() => {
    createAndLoginTA();
    createQueue({
      courseId: "ta.course.id",
    });
    checkInTA();
  });

  it("can toggle allow questions on and off", function () {
    // Visit the queue page
    cy.visit(`/course/${this.queue.courseId}/queue/${this.queue.id}`);

    // Change the toggle to not allow new quetsions
    cy.get("[data-cy='editQueue']").click();
    cy.get("[data-cy='allow-questions-toggle']").click();
    cy.get("span").contains("OK").click();

    // See that allow questions has been toggled off
    cy.get("[data-cy='stopQuestions']").should("exist");

    // Change the toggle back to allow new questions
    cy.get("[data-cy='editQueue']").click();
    cy.get("[data-cy='allow-questions-toggle']").click();
    cy.get("span").contains("OK").click();

    // See that the 'not allowing new questions' icon is not there any more
    cy.get("[data-cy='stopQuestions']").should("not.exist");
  });
});

describe("When allow questions is disabled", () => {
  beforeEach(() => {
    createAndLoginStudent();
    createQueue({
      courseId: "student.course.id",
      allowQuestions: false,
      identifier: "queue",
    });
  });
  it("student cannot add new questions when new questions are disabled", function () {
    // Visit the today page
    cy.visit(`/course/${this.queue.courseId}/today`);

    cy.get(".ant-modal-close-x").click();
    cy.get(".ant-modal-close-x").should("not.be.visible");

    // Check that the queue is not acccpeting new questions on the today page
    cy.get('[data-icon="stop"]').should("exist");

    cy.percySnapshot("Student Today Page - Not Allowing Questions");

    // Navigate to the queue
    cy.get('[data-cy="open-queue-button"]').click();

    // See that the queue is not accpeting new questions on the queue page
    cy.get("[data-cy='stopQuestions']").should("exist");

    // And that the join queue button is disabled
    cy.get('[data-cy="join-queue-button"]').should("be.disabled");

    cy.percySnapshot("Student Queue Page - Not Allowing Questions");
  });
});
