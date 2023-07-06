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
                })
            }

        }
    })
}


document.addEventListener('DOMContentLoaded', function() {
  edit();
})