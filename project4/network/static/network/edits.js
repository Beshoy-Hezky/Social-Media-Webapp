function edit(){
    // all edit divs do not load at the beginning
    const editdivs = document.querySelectorAll(".editable");
    editdivs.forEach(div => div.style.display="none");
    // to grab all edit buttons
    const editButtons = document.querySelectorAll('#edit');
    editButtons.forEach(button =>{
        button.onclick = function(){
            // Only one edit block can be visible at a time which will avoid id error
            const editdivs = document.querySelectorAll(".editable");
            editdivs.forEach(div => div.style.display="none");
            const contentdivs = document.querySelectorAll(".content");
            contentdivs.forEach(div => div.style.display="block");
            // to hide the content div for that specific button
            button.parentElement.style.display="none";
            // to show the edit div for that specific button
            button.parentElement.parentElement.querySelector(".editable").style.display="block";
            // to get the id of that post
            id = button.parentElement.querySelector("#id").innerHTML;
            //to get the specific submit button
            submit_button = document.querySelector("#submit-" + id);
            submit_button.onclick = function() {
                // to grab the new content
                new_content = document.querySelector("#forminfo-" + id).value;
                // to remove the textbox and the submit button
                submit_button.parentElement.style.display = "none";
                // to fill the same paragraph with the updated content
                document.querySelector("#paragraph-" + id).innerHTML = new_content;
                // display the updated content block
                submit_button.parentElement.parentElement.querySelector(".content").style.display = "block"
                // fetch response
                function gettoken(name){
                    const value = `;${document.cookie}`;
                    const parts = value.split(`;${name}=`);
                    if(parts.length == 2) return parts.pop().split(';').shift();
                }
                fetch(`/edit/${id}`,{
                    method: "POST",
                    headers: {"Content-type":"application/json", "X-CSRFToken":gettoken("csrftoken")},
                    body: JSON.stringify({
                        new_content: new_content
                    })
                }).then(response => response.json())
            }

        }
    })
}


document.addEventListener('DOMContentLoaded', function() {
  edit();
})


function subtract_indatabase(id,person_id){
        function gettoken(name) {
            const value = `;${document.cookie}`;
            const parts = value.split(`;${name}=`);
            if (parts.length == 2) return parts.pop().split(';').shift();
        }

    fetch(`/remove_like/${id}`,{
        method: "POST",
        headers: {"Content-type":"application/json", "X-CSRFToken":gettoken("csrftoken")},
        body: JSON.stringify({
            person_id: person_id
        })
    }).then(response => response.json())
}


function add_indatabase(id,person_id){
        function gettoken(name) {
            const value = `;${document.cookie}`;
            const parts = value.split(`;${name}=`);
            if (parts.length == 2) return parts.pop().split(';').shift();
        }

    fetch(`/add_like/${id}`,{
        method: "POST",
        headers: {"Content-type":"application/json", "X-CSRFToken":gettoken("csrftoken")},
        body: JSON.stringify({
            person_id: person_id
        })
    }).then(response => response.json())
}

function mySwitch(div) {
    let likes = div.parentElement.querySelector("#num-of-likes").innerHTML;
    let id = div.parentElement.querySelector("#id").innerHTML;
    let person_id = div.parentElement.querySelector("#person-id").innerHTML;
    let likes_number = parseInt(likes);

    if (div.innerHTML === `<i class="fa-solid fa-heart fa-xl" style="color: #7F7CFF;"></i>`) {
        likes_number = likes_number - 1;
        div.innerHTML = `<i class="fa-regular fa-heart fa-xl" style="color: #7F7CFF;"></i>`;
        div.parentElement.querySelector("#num-of-likes").innerHTML = likes_number.toString();
        // to actually effect the database
        subtract_indatabase(id,person_id);
    }
    else if (div.innerHTML === `<i class="fa-regular fa-heart fa-xl" style="color: #7F7CFF;"></i>`) {
            likes_number = likes_number + 1;
            div.innerHTML = `<i class="fa-solid fa-heart fa-xl" style="color: #7F7CFF;">`
            div.parentElement.querySelector("#num-of-likes").innerHTML = likes_number.toString();
            // to actually effect the database
            add_indatabase(id,person_id);
        }


}
