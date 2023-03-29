// Select relevant HTML elements
const selectNumbForm = document.querySelector("#select-numb");
const filterButtons = document.querySelectorAll("#filter-buttons button");
const filterableCards = document.querySelectorAll("#filterable-cards .card");
const selectedCardArea = document.querySelector("#selected-cards");
const frontShirt = document.querySelector(".front .draggable-area");
const backShirt = document.querySelector(".back .draggable-area");

let selectedCardsArr = []; // an array to hold the selected cards

// Function to filter cards based on filter buttons
const filterCards = (e) => {
    document.querySelector("#filter-buttons .active").classList.remove("active");
    e.target.classList.add("active");

    filterableCards.forEach(card => {
        // show the card if it matches the clicked filter or show all cards if "all" filter is clicked
        if(card.dataset.name === e.target.dataset.filter || e.target.dataset.filter === "all") {
            return card.classList.replace("hide", "show");
        }
        card.classList.add("hide");
    });
}

// Function to select cards on click
const selectCards = (e) => {
    let selectedCard = e.target.closest(".card"); // get the card that was clicked
    // if maximum number of cards are already selected or the clicked card is already selected, return without doing anything
    if(selectedCardsArr.length >= selectNumbForm.value && !selectedCard.classList.contains("selected")) return;

    selectedCard.classList.toggle("selected");
    // add or remove the selected card from the selectedCardsArr array based on its selection state
    if(selectedCard.classList.contains("selected")) {
        selectedCardsArr.push(selectedCard);
    } else {
        selectedCardsArr = selectedCardsArr.filter(card => card != selectedCard);
    }
    showSelectedCards(selectedCardsArr); // update the selected cards area to display the selected cards
}

// Function to display the selected cards in the selected cards area
const showSelectedCards = (cardsArray) => {
    selectedCardArea.innerHTML = cardsArray.map(card => 
        `<li class="d-flex align-items-center mb-3">
            <img src="${card.querySelector('img').src}" class="img-fluid" alt="img">
            <select class="form-select form-select-sm mx-2">
                <option value="front">Front</option>
                <option value="back">Back</option>
            </select>
            <button onclick="addToShirt(this, '${card.querySelector('img').src}')" class="btn btn-sm btn-secondary">Add</button>
        </li>`
    ).join("");
}

// Function to initialize drag and resize events for a selected card/image
function initDragAndResize(e) {
    const left = this.offsetLeft - (e.pageX || e.touches[0].pageX);
    const top = this.offsetTop - (e.pageY || e.touches[0].pageY);

    const rect = this.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    // Prevent scrolling on touch devices
    if(e.touches?.length && e.cancelable) {
        document.body.classList.add("hide-scrollbar");
    };
    
    const move = (e) => {
        // Get the draggable area for limiting movement
        const draggableArea = this.closest(".draggable-area");
        const maxLeft = draggableArea.offsetWidth - this.offsetWidth;
        const maxTop = draggableArea.offsetHeight - this.offsetHeight;
        let newLeft  = (e.pageX || e.touches[0].pageX) + left;
        let newTop = (e.pageY || e.touches[0].pageY) + top;

        // Limit the element's movement within the draggable area
        newLeft = newLeft < 0 ? 0 : newLeft > maxLeft ? maxLeft : newLeft;
        newTop = newTop < 0 ? 0 : newTop > maxTop ? maxTop : newTop;

        // Set the element's new position
        this.style.left = `${newLeft}px`;
        this.style.top = `${newTop}px`;
    }

    // Function for resizing the element
    const resize = (e) => {
        // Calculate new width and height of the element
        const newWidth = rect.width + ((e.clientX || e.touches[0].clientX) - rect.left - x);
        const newHeight = rect.height + ((e.clientY || e.touches[0].clientY) - rect.top - y);

        // Set the element's new width and height
        this.style.width = `${newWidth}px`;
        this.style.height = `${newHeight}px`;
    }

    // Check if the mouse/touch is on the bottom-right corner of the element
    const isBottomRight = (x > rect.width - 20) && (y > rect.height - 20);

    // Add event listeners for dragging and resizing
    document.addEventListener("mousemove", isBottomRight ? resize : move);
    document.addEventListener("touchmove", isBottomRight ? resize : move);

    // Remove event listeners when dragging/resizing is finished
    const removeListeners = () => {
        document.body.classList.remove("hide-scrollbar");
        document.removeEventListener("mousemove", isBottomRight ? resize : move);
        document.removeEventListener("touchmove", isBottomRight ? resize : move);
    }

    document.addEventListener("mouseup", removeListeners);
    document.addEventListener("touchend", removeListeners);
    document.addEventListener("touchcancel", removeListeners);
}
  
// Function to add an image to the shirt
const addToShirt = (elem, imgURL) => {
    const selectValue = elem.parentElement.querySelector("select").value;
    // Create a new <div> element with class "draggable-img" and set img element inside it
    const div = document.createElement("div");
    div.classList.add("draggable-img");
    div.innerHTML = `<img src="${imgURL}" alt="img" />`;

    // Add event listeners to allow the <div> to be dragged and resized
    div.addEventListener("touchstart", initDragAndResize);
    div.addEventListener("mousedown", initDragAndResize);

    // Append the <div> to either the "frontShirt" or "backShirt" element, depending on the selected value
    selectValue === "front" ? frontShirt.appendChild(div) : backShirt.appendChild(div);
}

filterButtons.forEach(button => button.addEventListener("click", filterCards));
filterableCards.forEach(button => button.addEventListener("click", selectCards));