describe('Fluxo Completo de Notas', () => {

  it('aluno faz a prova de IOT e mentor visita a página de alunos', () => {
    
    // --- ETAPA 1: ALUNO FAZ A PROVA ---
    cy.session('alunoSession', () => {
      cy.visit('http://127.0.0.1:5500/Login Principal/login.html');
      
      cy.get('#email').type('julio@email.com');
      cy.get('#senha').type('1111');
      cy.get('form#login-form').submit();

      cy.url().should('not.include', 'login'); 
    });

    cy.visit('http://127.0.0.1:5500/IOT/Aula01IOT/Exercicios/index.html');

    // Responde as questões
    cy.get('[data-question="q1"][data-value="A"]').click();
    cy.get('[data-question="q2"][data-value="C"]').click();
    cy.get('#sendButton').click();

    // Verifica a nota na tela do aluno
    cy.get('#nota').should('contain.text', '10.0');
    
    // --- ETAPA 2: MENTOR VERIFICA A NOTA ---
    cy.session('mentorSession', () => {
      cy.visit('http://127.0.0.1:5500/Login Professor/index.html');
      
      cy.get('#email').type('paulo@email.com');
      cy.get('#senha').type('2222');
      cy.get('.btn-continuar').click();
      
      cy.url().should('not.include', 'login');
    });

    // Com a sessão do mentor ativa, vamos para a página de alunos.
    cy.visit('http://127.0.0.1:5500/Tela inicial Mentor/MentorIOT/Alunos/index.html');


    
    /*
    cy.contains('.student-item', 'Julio')
      .find('.student-score')
      .should('contain.text', '10,0');
    */

  });

});