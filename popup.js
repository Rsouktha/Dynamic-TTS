window.onload = function() {
    document.getElementById("mini-screen").addEventListener("click", miniPop)

    function miniPop() {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // Typical action to be performed when the document is ready:
                document.getElementById("main").innerHTML = xhttp.responseText;
            }
        };
        xhttp.open("GET", "miniscreen.html", true);
        xhttp.send();
    }
}
