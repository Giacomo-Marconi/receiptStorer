const submit = document.getElementById('submit');

submit.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("1111");
    const input = document.getElementById('image');

    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);
    fetch('http://127.0.0.1:20002/addData', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log("2222");
            console.log(data);
        });
});
