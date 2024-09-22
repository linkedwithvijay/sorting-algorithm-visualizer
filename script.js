let array = [];
let speed = 100; // Default speed
let maxValue = 200; // Initial max value

function generateArray() {
    const arraySize = parseInt(document.getElementById('array-size').value);
    array = [];
    const arrayContainer = document.getElementById('array-container');
    arrayContainer.innerHTML = '';

    for (let i = 0; i < arraySize; i++) {
        const value = Math.floor(Math.random() * 200) + 5;
        array.push(value);
    }
    updateBars();
}

function updateBars() {
    const arrayContainer = document.getElementById('array-container');
    arrayContainer.innerHTML = '';
    maxValue = Math.max(...array);
    const containerHeight = 350; // Height of the container in pixels

    for (let i = 0; i < array.length; i++) {
        const value = array[i];
        const barHeight = (value / maxValue) * containerHeight;
        createArrayBar(value, barHeight);
    }
}

function createArrayBar(value, height) {
    const arrayContainer = document.getElementById('array-container');
    const arrayBar = document.createElement('div');
    arrayBar.classList.add('array-bar');
    arrayBar.style.height = `${height}px`;

    const barLabel = document.createElement('div');
    barLabel.classList.add('bar-label');
    barLabel.textContent = value;

    arrayBar.appendChild(barLabel);
    arrayContainer.appendChild(arrayBar);
}

function addCustomElements() {
    const customInput = document.getElementById('custom-input').value;
    const customArray = customInput.split(',').map(item => parseInt(item.trim())).filter(item => !isNaN(item));
    
    if (customArray.length === 0) {
        alert('Please enter valid numbers separated by commas.');
        return;
    }

    array = customArray;
    updateBars();
}

async function bubbleSort() {
    const bars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            bars[j].style.backgroundColor = 'red';
            bars[j + 1].style.backgroundColor = 'red';

            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
            }

            bars[j].style.backgroundColor = 'teal';
            bars[j + 1].style.backgroundColor = 'teal';
        }
    }
}

async function insertionSort() {
    const bars = document.getElementsByClassName('array-bar');
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;

        bars[i].style.backgroundColor = 'red';

        while (j >= 0 && array[j] > key) {
            bars[j].style.backgroundColor = 'red';
            await swap(j, j + 1);
            j--;

            bars[j + 1].style.backgroundColor = 'teal';
        }

        array[j + 1] = key;
        bars[i].style.backgroundColor = 'teal';
    }
}

async function selectionSort() {
    const bars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < array.length - 1; i++) {
        let minIdx = i;
        bars[i].style.backgroundColor = 'red';

        for (let j = i + 1; j < array.length; j++) {
            bars[j].style.backgroundColor = 'red';

            if (array[j] < array[minIdx]) {
                minIdx = j;
            }

            bars[j].style.backgroundColor = 'teal';
        }

        if (minIdx !== i) {
            await swap(i, minIdx);
        }
        bars[i].style.backgroundColor = 'teal';
    }
}

async function mergeSort() {
    const bars = document.getElementsByClassName('array-bar');
    await mergeSortHelper(0, array.length - 1, bars);
}

async function mergeSortHelper(start, end, bars) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    await mergeSortHelper(start, mid, bars);
    await mergeSortHelper(mid + 1, end, bars);
    await merge(start, mid, end, bars);
}

async function merge(start, mid, end, bars) {
    const leftArr = array.slice(start, mid + 1);
    const rightArr = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < leftArr.length && j < rightArr.length) {
        bars[k].style.backgroundColor = 'red';
        await new Promise(resolve => setTimeout(resolve, speed));

        if (leftArr[i] <= rightArr[j]) {
            array[k] = leftArr[i];
            i++;
        } else {
            array[k] = rightArr[j];
            j++;
        }

        updateSingleBar(k);
        bars[k].style.backgroundColor = 'teal';
        k++;
    }

    while (i < leftArr.length) {
        bars[k].style.backgroundColor = 'red';
        await new Promise(resolve => setTimeout(resolve, speed));

        array[k] = leftArr[i];
        updateSingleBar(k);
        bars[k].style.backgroundColor = 'teal';
        i++;
        k++;
    }

    while (j < rightArr.length) {
        bars[k].style.backgroundColor = 'red';
        await new Promise(resolve => setTimeout(resolve, speed));

        array[k] = rightArr[j];
        updateSingleBar(k);
        bars[k].style.backgroundColor = 'teal';
        j++;
        k++;
    }
}

async function quickSort() {
    const bars = document.getElementsByClassName('array-bar');
    await quickSortHelper(0, array.length - 1, bars);
}

async function quickSortHelper(start, end, bars) {
    if (start >= end) return;

    const pivotIndex = await partition(start, end, bars);
    await quickSortHelper(start, pivotIndex - 1, bars);
    await quickSortHelper(pivotIndex + 1, end, bars);
}

async function partition(start, end, bars) {
    const pivotValue = array[end];
    let pivotIndex = start;

    bars[end].style.backgroundColor = 'yellow'; // Highlight pivot

    for (let i = start; i < end; i++) {
        bars[i].style.backgroundColor = 'red';
        await new Promise(resolve => setTimeout(resolve, speed));

        if (array[i] < pivotValue) {
            await swap(i, pivotIndex);
            pivotIndex++;
        }

        bars[i].style.backgroundColor = 'teal';
    }

    await swap(pivotIndex, end);
    bars[end].style.backgroundColor = 'teal';

    return pivotIndex;
}

function swap(i, j) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;

            updateSingleBar(i);
            updateSingleBar(j);

            resolve();
        }, speed);
    });
}

function updateSingleBar(index) {
    const bars = document.getElementsByClassName('array-bar');
    const containerHeight = 350; // Height of the container in pixels
    const height = (array[index] / maxValue) * containerHeight;

    bars[index].style.height = `${height}px`;
    bars[index].querySelector('.bar-label').textContent = array[index];
}

// Update speed when slider value changes
document.getElementById('speed-slider').addEventListener('input', (event) => {
    speed = parseInt(event.target.value);
    document.getElementById('speed-value').textContent = speed;
});

// Generate array on page load with a default size
generateArray();