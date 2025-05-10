document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const categoriesPage = document.getElementById("categories-page")
    const linksPage = document.getElementById("links-page")
    const categoriesContainer = document.getElementById("categories-container")
    const linksContainer = document.getElementById("links-container")
    const categoryTitle = document.getElementById("category-title")
    const categorySearch = document.getElementById("category-search")
    const linkSearch = document.getElementById("link-search")
  
    // Modals
    const addCategoryModal = document.getElementById("add-category-modal")
    const addLinkModal = document.getElementById("add-link-modal")
    const categoryNameInput = document.getElementById("category-name")
    const linkTitleInput = document.getElementById("link-title")
    const linkUrlInput = document.getElementById("link-url")
    const linkTagsInput = document.getElementById("link-tags")
  
    // Buttons
    const addCategoryBtn = document.getElementById("add-category-btn")
    const saveCategoryBtn = document.getElementById("save-category-btn")
    const addLinkBtn = document.getElementById("add-link-btn")
    const saveLinkBtn = document.getElementById("save-link-btn")
    const backBtn = document.getElementById("back-btn")
    const closeBtns = document.querySelectorAll(".close-btn")
  
    // Toast
    const toast = document.getElementById("toast")
    const toastMessage = document.getElementById("toast-message")
  
    // Current category ID
    let currentCategoryId = null
  
    // Initialize data
    initializeData()
  
    // Event Listeners
    addCategoryBtn.addEventListener("click", () => openModal(addCategoryModal))
    saveCategoryBtn.addEventListener("click", saveCategory)
    addLinkBtn.addEventListener("click", () => openModal(addLinkModal))
    saveLinkBtn.addEventListener("click", saveLink)
    backBtn.addEventListener("click", goBackToCategories)
    closeBtns.forEach((btn) => btn.addEventListener("click", closeModals))
    categorySearch.addEventListener("input", filterCategories)
    linkSearch.addEventListener("input", filterLinks)
  
    // Functions
    function initializeData() {
      chrome.storage.local.get(["categories", "links"], (result) => {
        const categories = result.categories || []
        renderCategories(categories)
      })
    }
  
    function renderCategories(categories) {
      categoriesContainer.innerHTML = ""
  
      if (categories.length === 0) {
        categoriesContainer.innerHTML = `
          <div class="empty-state" style="grid-column: span 2; text-align: center; padding: 32px 0;">
            <p>No categories found. Add your first category!</p>
          </div>
        `
        return
      }
  
      categories.forEach((category) => {
        const categoryCard = document.createElement("div")
        categoryCard.className = "card"
        categoryCard.innerHTML = `
          <div class="card-title">${category.name}</div>
          <div class="card-actions">
            <button class="btn btn-icon btn-sm delete-category" data-id="${category.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        `
  
        categoryCard.addEventListener("click", (e) => {
          if (!e.target.closest(".delete-category")) {
            openCategory(category.id)
          }
        })
  
        categoriesContainer.appendChild(categoryCard)
      })
  
      // Add event listeners for delete buttons
      document.querySelectorAll(".delete-category").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation()
          const categoryId = btn.getAttribute("data-id")
          deleteCategory(categoryId)
        })
      })
    }
  
    function renderLinks(links) {
        linksContainer.innerHTML = ""
      
        if (links.length === 0) {
          linksContainer.innerHTML = `
            <div class="empty-state" style="grid-column: span 2; text-align: center; padding: 32px 0;">
              <p>No links found. Add your first link!</p>
            </div>
          `
          return
        }
      
        links.forEach((link) => {
          const linkCard = document.createElement("div")
          linkCard.className = "card link-card"
      
          // Add debugging to check the value of link.tags
          console.log("Link tags:", link.tags);
      
          // Ensure link.tags is an array (fallback to empty array if not)
          const tagsHtml = (link.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join("")
      
          linkCard.innerHTML = `
            <div class="card-title">${link.title}</div>
            <div class="link-url">${link.url}</div>
            <div class="tags-container">${tagsHtml}</div>
            <div class="card-actions">
              <button class="btn btn-icon btn-sm copy-link" data-url="${link.url}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                </svg>
              </button>
              <button class="btn btn-icon btn-sm delete-link" data-id="${link.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          `
      
          linksContainer.appendChild(linkCard)
        })
      
        // Add event listeners for copy and delete buttons
        document.querySelectorAll(".copy-link").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation()
            const url = btn.getAttribute("data-url")
            copyToClipboard(url)
          })
        })
      
        document.querySelectorAll(".delete-link").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation()
            const linkId = btn.getAttribute("data-id")
            deleteLink(linkId)
          })
        })
      }
      
  
    function openCategory(categoryId) {
      chrome.storage.local.get(["categories", "links"], (result) => {
        const categories = result.categories || []
        const links = result.links || []
  
        const category = categories.find((cat) => cat.id === categoryId)
        if (!category) return
  
        currentCategoryId = categoryId
        categoryTitle.textContent = category.name
  
        const categoryLinks = links.filter((link) => link.categoryId === categoryId)
        renderLinks(categoryLinks)
  
        categoriesPage.classList.remove("active")
        linksPage.classList.add("active")
      })
    }
  
    function goBackToCategories() {
      currentCategoryId = null
      categoriesPage.classList.add("active")
      linksPage.classList.remove("active")
      initializeData()
    }
  
    function saveCategory() {
      const categoryName = categoryNameInput.value.trim()
      if (!categoryName) {
        showToast("Please enter a category name")
        return
      }
  
      chrome.storage.local.get(["categories"], (result) => {
        const categories = result.categories || []
        const newCategory = {
          id: generateId(),
          name: categoryName,
          createdAt: new Date().toISOString(),
        }
  
        categories.push(newCategory)
  
        chrome.storage.local.set({ categories }, () => {
          renderCategories(categories)
          closeModals()
          categoryNameInput.value = ""
          showToast("Category added successfully")
        })
      })
    }
  
    function saveLink() {
      const title = linkTitleInput.value.trim()
      const url = linkUrlInput.value.trim()
      const tagsInput = linkTagsInput.value.trim()
  
      if (!title || !url) {
        showToast("Please enter title and URL")
        return
      }
  
      if (!currentCategoryId) {
        showToast("No category selected")
        return
      }
  
      // Parse tags
      const tags = tagsInput
        ? tagsInput
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : []
  
      chrome.storage.local.get(["links"], (result) => {
        const links = result.links || []
        const newLink = {
          id: generateId(),
          categoryId: currentCategoryId,
          title,
          url,
          tags,
          createdAt: new Date().toISOString(),
        }
  
        links.push(newLink)
  
        chrome.storage.local.set({ links }, () => {
          const categoryLinks = links.filter((link) => link.categoryId === currentCategoryId)
          renderLinks(categoryLinks)
          closeModals()
          linkTitleInput.value = ""
          linkUrlInput.value = ""
          linkTagsInput.value = ""
          showToast("Link added successfully")
        })
      })
    }
  
    function deleteCategory(categoryId) {
      if (confirm("Are you sure you want to delete this category? All links in this category will also be deleted.")) {
        chrome.storage.local.get(["categories", "links"], (result) => {
          let categories = result.categories || []
          let links = result.links || []
  
          // Remove the category
          categories = categories.filter((cat) => cat.id !== categoryId)
  
          // Remove all links in the category
          links = links.filter((link) => link.categoryId !== categoryId)
  
          chrome.storage.local.set({ categories, links }, () => {
            renderCategories(categories)
            showToast("Category deleted successfully")
          })
        })
      }
    }
  
    function deleteLink(linkId) {
      if (confirm("Are you sure you want to delete this link?")) {
        chrome.storage.local.get(["links"], (result) => {
          let links = result.links || []
  
          // Remove the link
          links = links.filter((link) => link.id !== linkId)
  
          chrome.storage.local.set({ links }, () => {
            const categoryLinks = links.filter((link) => link.categoryId === currentCategoryId)
            renderLinks(categoryLinks)
            showToast("Link deleted successfully")
          })
        })
      }
    }
  
    function filterCategories() {
      const searchTerm = categorySearch.value.toLowerCase()
  
      chrome.storage.local.get(["categories"], (result) => {
        const categories = result.categories || []
  
        if (!searchTerm) {
          renderCategories(categories)
          return
        }
  
        const filteredCategories = categories.filter((category) => category.name.toLowerCase().includes(searchTerm))
  
        renderCategories(filteredCategories)
      })
    }
  
    function filterLinks() {
      const searchTerm = linkSearch.value.toLowerCase()
  
      chrome.storage.local.get(["links"], (result) => {
        const links = result.links || []
  
        if (!currentCategoryId) return
  
        const categoryLinks = links.filter((link) => link.categoryId === currentCategoryId)
  
        if (!searchTerm) {
          renderLinks(categoryLinks)
          return
        }
  
        const filteredLinks = categoryLinks.filter(
          (link) =>
            link.title.toLowerCase().includes(searchTerm) ||
            link.url.toLowerCase().includes(searchTerm) ||
            link.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
        )
  
        renderLinks(filteredLinks)
      })
    }
  
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(
        () => {
          showToast("Link copied to clipboard")
        },
        () => {
          showToast("Failed to copy link")
        },
      )
    }
  
    function openModal(modal) {
      closeModals()
      modal.classList.add("active")
    }
  
    function closeModals() {
      addCategoryModal.classList.remove("active")
      addLinkModal.classList.remove("active")
    }
  
    function showToast(message) {
      toastMessage.textContent = message
      toast.classList.add("active")
  
      setTimeout(() => {
        toast.classList.remove("active")
      }, 3000)
    }
  
    function generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    }
  })
  