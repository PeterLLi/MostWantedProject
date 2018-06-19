"use strict";

app(data);

function app(people){
	let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo);

	switch(searchType){
		case 'yes':
			searchByName(people);
			break;
		case 'no':
			searchByTraits(people);
			break;
		default:
			alert("Wrong! Please try again, following the instructions dummy. :)");
			app(people);
			break;
	}
}

function executeSearch(people, criteriaCounter){
	let userSearchChoice = prompt("What would you like to search by? 'height', 'weight', 'eye color', 'gender', 'age', 'occupation'.");
	let filteredPeople;

	criteriaCounter++;
    switch(userSearchChoice){
		case "height":
			filteredPeople = searchByHeight(people);
			break;
		case "weight":
			filteredPeople = searchByWeight(people);
			break;
		case "eye color":
			filteredPeople = searchByEyeColor(people);
			break;
		case "gender":
			filteredPeople = searchByGender(people);
			break;
		case "age":
			filteredPeople = searchByAge(people);
			break;
		case "occupation":
			filteredPeople = searchByOccupation(people);
			break;
		default:
			alert("You entered an invalid search type! Please try again.");
			filteredPeople = executeSearch(people,5);
			break;
	}

	if (criteriaCounter < 5){
		let moreCriteriaPrompt = promptFor("Do you want to include more search criteria? Answer 'Yes' or 'No'",yesNo);
		if (moreCriteriaPrompt === "yes"){
			filteredPeople = executeSearch(filteredPeople,criteriaCounter);
		}
	}
	return filteredPeople;
}

function searchByTraits(people) {
	let moreCriteria = true;
	let filteredPeople = executeSearch(people, 0);

	if(filteredPeople.length === 0){
		alert("Unable to find anyone matching search criteria.");
		app(people);
	}else{
		let arrayIndexCounter = 0;
		let searchResultArray = filteredPeople.map(function(el){
			arrayIndexCounter++;
			return arrayIndexCounter+". "+el.lastName+", "+el.firstName;
		})

		let searchResultString = searchResultArray.join("\n");
		let selectedPersonNumber;

		do{
			selectedPersonNumber = Number(prompt("The following people matched the search criteria. Select a person by number:\n"+searchResultString+"\n"));
		}while(!Number.isInteger(selectedPersonNumber) || selectedPersonNumber > searchResultArray.length || selectedPersonNumber <= 0)
		mainMenu(filteredPeople[selectedPersonNumber-1], people);
	}
}

function searchByAge(people){
	let userInputAge = Number(promptFor("Enter this person's age as an integer",isNumeric));
	let newArray = people.filter(function (el){
		if(calculateAgeFromBirthDate(el.dob)===Number(userInputAge)){
			return true;
		}
	});
	return newArray;
}

function searchByEyeColor(people){
	let userInputEyeColor = prompt("Enter this person's eye color.");
	let newArray = people.filter(function(el){
		if(el.eyeColor === userInputEyeColor){
			return true;
		}
	});
	return newArray;
}

function searchByGender(people){
	let userInputGender = promptFor("Enter this person's gender as 'male' or 'female'",isGender);
	let newArray = people.filter(function(el){
		if(el.gender === userInputGender){
			return true;
	    }
	});
	return newArray;
}

function searchByHeight(people){
	let userInputHeight = Number(promptFor("Enter this person's height as an integer.",isNumeric));
	let newArray = people.filter(function(el){
		if(el.height === userInputHeight){
			return true;
		}
	});
	return newArray;
}

function searchByOccupation(people){
	let userInputOccupation = prompt("Enter this person's occupation.");
	let newArray = people.filter(function(el){
		if(el.occupation === userInputOccupation){
			return true;
		}
	});
	return newArray;
}

function searchByWeight(people){
	let userInputWeight = Number(promptFor("Enter this person's weight as an integer",isNumeric));
	let newArray = people.filter(function(el){
		if(el.weight === userInputWeight) {
			return true;
		}
	});
	return newArray;
}

function mainMenu(person, people){
	if(!person){
		alert("Could not find that individual.");
		return app(people);
	}

	let displayOption = prompt("Found " + person.firstName + " " + person.lastName
		+ " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'").toLowerCase();

	switch(displayOption){
		case "info":
			displayPerson(person);
			break;
		case "family":
			familyInfo(person, people);
			break;
		case "descendants":
			let descendantString = descendantInfo(person, people,true);

			descendantString = descendantString.map(function(el){
				return el.firstName + " " + el.lastName;
			});

			if(descendantString.length >= 1){
				alert(person.firstName + " " + person.lastName + "'s descendants are:\n" + descendantString.join("\n"));
			} else {
				alert("This person does not have any descendants.")
			}
			break;
		case "restart":
			app(people);
			break;
		case "quit":
			return;
		default:
			return mainMenu(person, people);
	}
}

function searchByName(people){
	let firstName = promptFor("What is the person's first name?", chars);
	let lastName = promptFor("What is the person's last name?", chars);
	let arrayLength = people.length;
	let selectedPerson = "";

	for(let i = 0; i < arrayLength; i++){
		if(people[i].firstName.toLowerCase() === firstName && people[i].lastName.toLowerCase() === lastName){
			selectedPerson = people[i];
			mainMenu(selectedPerson,people);
		}
	}

	if(selectedPerson === ""){
		alert("We couldn't find the person you were looking for.");
		searchByName(people);
	}
}

function displayPeople(people){
	alert(people.map(function(person){
		return person.firstName + " " + person.lastName;
	}).join("\n"));
}

function displayPerson(person){
	let personPropertyKeys = Object.keys(person);
	let personPropertyValues = Object.values(person);

	let displayString = "";
	for (let i = 0; i < 9; i++){
		displayString += personPropertyKeys[i] + ": " + personPropertyValues[i] + "\n";
	}
	alert(displayString);
}

function descendantInfo(person, people, getAllDescendants){
	let descendantsArray = people.filter(function(el){
		for(let i = 0; i < el.parents.length; i++){
			if(person.id === el.parents[i]){
				return true;
			}
		}
	});
	if (getAllDescendants){
		for(let j = 0; j < descendantsArray.length; j++){
			descendantsArray.push.apply(descendantsArray, descendantInfo(descendantsArray[j], people, true));
		}
  }
    return descendantsArray;
}

function familyInfo(person, people){
	let parentSet = [];
	let spouseSet = [];
	let siblings = [];
	let siblingSet = [];

	if(person.parents.length >= 1){
		for(let i = 0; i < person.parents.length; i++){
			for(let j = 0; j < people.length; j++){
				if(person.parents[i] === people[j].id){
					let parentName = people[j].firstName + " " + people[j].lastName;
					parentSet.push(parentName);

					siblings = descendantInfo(people[j], people, false);
					siblings = (siblings.map(function(el){
						return el.firstName + " " + el.lastName;
        			}))
					siblingSet.push(siblings.join(", "));
				}
			}
		}
	}


	if(siblingSet[0] === siblingSet[1]){
		siblingSet.splice(0,1);
	}

	if (siblingSet[0] !== undefined){
		if (siblingSet[0].indexOf(person.firstName+" "+person.lastName)!==-1){
			let indexOfStart = siblingSet[0].indexOf(person.firstName+" "+person.lastName);
			let indexOfEnd = indexOfStart+person.firstName.length+person.lastName.length+1;
			let forwardString = siblingSet[0].slice(0,indexOfStart);
			let rearString = siblingSet[0].slice(indexOfEnd+2,siblingSet[0].length);
			siblingSet[0] = forwardString+rearString;
			if (siblingSet[0].slice(siblingSet[0].length-1) === " "){
				siblingSet[0] = siblingSet[0].slice(0,siblingSet[0].length-2);
			}
		}
	}

	let childArray = descendantInfo(person, people, false);
	let childSet = childArray.map(function(el){
		return el.firstName + " " + el.lastName;
	});

	if(person.currentSpouse !== null){
		for(let j = 0; j < people.length; j++){
			if(person.currentSpouse === people[j].id){
				let spouseName = people[j].firstName + " " + people[j].lastName;
				spouseSet.push(spouseName);
			}
		}
	}else if(person.currentSpouse === null){
		spouseSet.push("No spouse found");
	}
	if(siblingSet < 1){
		siblingSet.unshift("No siblings found");
	}

	if(parentSet < 1){
		parentSet.push("No parents found");
	}

	if(childSet.length < 1){
		childSet.push("No children found");
	}
	let displayString = "Parents: " + parentSet.join(", ") + "\nSiblings: " + siblingSet[0] + "\nSpouse: " + spouseSet[0] + "\nChildren: " + childSet.join(", ");
	alert(displayString);
}

function promptFor(question, valid){
	let response;
	response = prompt(question).trim();
	while (!response || !valid(response)){
		alert("Invalid input. Please enter data as prompted.")
		response = prompt(question).trim();
	}
		return response.toLowerCase();
	}

function yesNo(input){
	return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

function isGender(input){
	return input === "male" || input === "female";
}

function isNumeric(input){
	input = Number(input);
	return Number.isInteger(input);
}

function chars(input){
	return true;
}

function calculateAgeFromBirthDate(birthDateString){
	let today = new Date();
	let birthDate = new Date(birthDateString);
	let age = today.getFullYear() - birthDate.getFullYear();

	if(birthDate.getMonth() > today.getMonth()){
		age--;
	}else if(birthDate.getMonth()===today.getMonth() && birthDate.getDate() > today.getDate()){
		age--;
	}
	return age;
}