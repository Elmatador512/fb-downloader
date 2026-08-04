const urlInput = document.getElementById("url");
const button = document.getElementById("downloadBtn");
const loader = document.getElementById("loader");
const result = document.getElementById("result");
const progressBar = document.getElementById("progress-bar");


button.addEventListener("click", async function(){

    const url = urlInput.value.trim();

    result.innerHTML = "";


    if(url === ""){

        result.innerHTML = `
        <p style="color:red;font-weight:bold;">
        ❌ Colle un lien vidéo.
        </p>`;

        return;
    }


    if(!url.startsWith("http://") && !url.startsWith("https://")){

        result.innerHTML = `
        <p style="color:red;font-weight:bold;">
        ❌ Le lien n'est pas valide.
        </p>`;

        return;

    }


    loader.style.display = "block";
    button.disabled = true;


    if(progressBar){

        progressBar.style.width = "20%";

        setTimeout(()=>{

            progressBar.style.width = "60%";

        },500);

    }



    try{


        const response = await fetch(
    "https://fb-downloader-zpwk.onrender.com/download",
            {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                url:url
            })

            }
        );


        const data = await response.json();


        let videoUrl = null;


        if(data.url){

            videoUrl = data.url;

        }


        else if(data.picker && data.picker.length > 0){

            videoUrl = data.picker[0].url;

        }



        if(progressBar){

            progressBar.style.width = "100%";

        }



        if(videoUrl){


            result.innerHTML = `

            <p style="color:green;font-weight:bold;">
            ✅ Vidéo prête
            </p>

            <br>

            <a href="${videoUrl}"
            target="_blank"
            style="
            color:#1877f2;
            font-size:18px;
            font-weight:bold;
            text-decoration:none;
            ">

            📥 Télécharger la vidéo

            </a>

            `;


        }else{


            result.innerHTML = `

            <p style="color:red;font-weight:bold;">
            ❌ Vidéo introuvable.
            Vérifie que le lien est public.
            </p>

            `;

        }



    }catch(error){


        result.innerHTML = `

        <p style="color:red;font-weight:bold;">
        ❌ Erreur du serveur.
        Réessaie plus tard.
        </p>

        `;


        console.log(error);


    }



    loader.style.display = "none";
    button.disabled = false;


});
