document.addEventListener("DOMContentLoaded", function() {
    const semesterSelect = document.querySelector(".semester-select");

    semesterSelect.addEventListener("change", function() {
        alert("Você selecionou: " + semesterSelect.value);
    });

    // Adicionando eventos de clique nos itens "subject"
    const subjects = document.querySelectorAll(".subject");

    subjects.forEach(subject => {
        subject.addEventListener("click", function() {
            const subjectName = subject.querySelector("p").textContent;
            alert("Você clicou em: " + subjectName);
        });
    });
});
