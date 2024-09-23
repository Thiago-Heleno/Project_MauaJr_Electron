// fileUploadComponent.js
export function createFileUploadComponent(apiUrl) {
  const container = document.createElement('div');
  container.innerHTML = `
      <div class="file-upload" id="fileUploadArea">
          <p>Drag & drop files here or click to select</p>
          <input type="file" id="fileInput" class="hidden" multiple />
      </div>
      <ul class="file-list" id="fileList"></ul>
      <button id="uploadButton" class="hidden">Upload Files</button>
  `;

  const fileUploadArea = container.querySelector("#fileUploadArea");
  const fileInput = container.querySelector("#fileInput");
  const fileList = container.querySelector("#fileList");
  const uploadButton = container.querySelector("#uploadButton");

  // Handle file selection
  fileUploadArea.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", handleFiles);

  // Handle drag & drop
  fileUploadArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    fileUploadArea.classList.add("dragging");
  });

  fileUploadArea.addEventListener("dragleave", () => {
    fileUploadArea.classList.remove("dragging");
  });

  fileUploadArea.addEventListener("drop", (event) => {
    event.preventDefault();
    fileUploadArea.classList.remove("dragging");
    handleFiles(event.dataTransfer.files);
  });

  function handleFiles(files) {
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
      const li = document.createElement("li");
      li.textContent = file.name;
      fileList.appendChild(li);
    });

    uploadButton.classList.remove("hidden");
    uploadButton.onclick = () => uploadFiles(fileArray);
  }

  async function uploadFiles(files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("files[]", file); // Change "files[]" to match your API's expected format
    });

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        alert("Files uploaded successfully!");
      } else {
        console.error("Upload failed:", response.statusText);
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  }

  // Append CSS styles
  const style = document.createElement('style');
  style.innerHTML = `
      .file-upload {
          border: 2px dashed #007bff;
          border-radius: 10px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: background-color 0.3s;
      }

      .file-upload:hover {
          background-color: #f0f8ff;
      }

      .hidden {
          display: none;
      }

      .file-list {
          margin-top: 20px;
          list-style-type: none;
          padding: 0;
      }
  `;
  document.head.appendChild(style);

  return container;
}
