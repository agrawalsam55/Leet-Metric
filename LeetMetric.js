#JS CODE


document.addEventListener("DOMContentLoaded", function(){
    const searchButton = document.getElementById("search_button");
    const usernameInput = document.getElementById("user_input");
    const statsContainer = document.querySelector(".stats_container");
    const easyProgressCircle = document.querySelector(".easy_progress");
    const mediumProgressCircle = document.querySelector(".medium_progress");
    const hardProgressCircle = document.querySelector(".hard_progress");
    const easyLabel = document.getElementById("easy_label");
    const mediumLabel = document.getElementById("medium_label");
    const hardLabel = document.getElementById("hard_label");
    const cardStatsContainer = document.querySelector(".stats_card");

    function validateUSername(username){
        if(username.trim() === ""){
            alert("username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("Invalid username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username){

        try{
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            statsContainer.classList.add("hidden")

            // const response = await fetch(url);
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const targetUrl = 'https://leetcode.com/graphql/';
            const myHeaders = new Headers ();
            myHeaders.append ("content-type", "application/json");

    const graphql = JSON. stringify({
        query: "\n   query userSessionProgress($username: String!) {\n allQuestionsCount {\n   difficulty\n    count\n   }\n matchedUser (username: $username) {\nsubmitStats {\n    acSubmissionNum {\n    difficulty\n   count \n     submissions\n   }   \n   totalSubmissionNum {\n    difficulty\n   count\n  submissions\n      }\n     }\n    }\n}\n ",
        variables: { "username": `${username}` }
    })
        const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: graphql,
        redirect: "follow"
    }

    const response = await fetch(proxyUrl+targetUrl, requestOptions);

            if(!response.ok){
                throw new Error("unable to fetch the user details");
            }
            const passedData = await response.json();
            console.log("Logging data: ", passedData); 

            displayUserData(passedData);
        }
        catch(error){
            statsContainer.innerHTML = `<p>No Data Found</p>`
        }
        finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(passedData){
        const totalQues = passedData.data.allQuestionsCount[0].count;
        const totalEasyQues = passedData.data.allQuestionsCount[1].count;
        const totalMediumQues = passedData.data.allQuestionsCount[2].count;
        const totalHardQues = passedData.data.allQuestionsCount[3].count;

        const solvedTotalQues = passedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQues = passedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMediumQues = passedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalHardQues = passedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel , easyProgressCircle);
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

        const cardData = [
            {label: "Overall Submission", value:passedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
            {label: "Overall Easy Submission", value:passedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
            {label: "Overall Medium Submission", value:passedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
            {label: "Overall Hard Submission", value:passedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions},
        ];

        console.log("Card ka data", cardData);

        cardStatsContainer.innerHTML = cardData.map(
            data => {
                return `
                <div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                </div>`
            }
        ).join("")

    }
    searchButton.addEventListener('click', function(){
        const username = usernameInput.value;
        console.log("loggin username :", username);
        if(validateUSername(username)){
            fetchUserDetails(username);
        }
    })
});

