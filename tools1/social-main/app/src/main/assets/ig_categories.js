(function() {
    console.log("NSocial Instagram Categories Bridge Loaded");

    // Add a custom button to save posts into categories and download buttons
    function injectPostButtons() {
        const posts = document.querySelectorAll('article');
        posts.forEach(post => {
            const actionSection = post.querySelector('section');
            if (!actionSection) return;

            if (!post.querySelector('.nsocial-save-btn')) {
                const saveBtn = document.createElement('button');
                saveBtn.innerText = "📁";
                saveBtn.className = "nsocial-save-btn";
                saveBtn.style.border = "none";
                saveBtn.style.background = "none";
                saveBtn.style.fontSize = "20px";
                saveBtn.onclick = function() {
                    const postUrl = post.querySelector('a')?.href || window.location.href;
                    const category = prompt("Enter category name:", "General");
                    if (category) {
                        if (window.AndroidBridge) {
                            window.AndroidBridge.saveToCategory(postUrl, category);
                        }
                    }
                };
                actionSection.appendChild(saveBtn);
            }

            if (!post.querySelector('.nsocial-download-btn')) {
                const downloadBtn = document.createElement('button');
                downloadBtn.innerText = "⬇️";
                downloadBtn.className = "nsocial-download-btn";
                downloadBtn.style.border = "none";
                downloadBtn.style.background = "none";
                downloadBtn.style.fontSize = "20px";
                downloadBtn.onclick = function() {
                    const mediaUrl = getMediaUrl(post);
                    if (mediaUrl && window.AndroidBridge) {
                        window.AndroidBridge.downloadMedia(mediaUrl, null);
                    } else {
                        alert("Could not find media URL");
                    }
                };
                actionSection.appendChild(downloadBtn);
            }
        });
    }

    function getMediaUrl(element) {
        // Try to find image or video
        const img = element.querySelector('img[srcset], img.xpdipqx');
        if (img) return img.src;
        const video = element.querySelector('video');
        if (video) return video.src;
        const anyImg = element.querySelector('img');
        if (anyImg) return anyImg.src;
        return null;
    }

    function injectDownloadAllButton() {
        if (document.querySelector('.nsocial-download-all-btn')) return;

        // Check if we are on a profile page (header usually has username)
        const header = document.querySelector('header');
        if (!header) return;

        const downloadAllBtn = document.createElement('button');
        downloadAllBtn.innerText = "Download All Visible";
        downloadAllBtn.className = "nsocial-download-all-btn";
        downloadAllBtn.style.position = "fixed";
        downloadAllBtn.style.bottom = "70px";
        downloadAllBtn.style.right = "20px";
        downloadAllBtn.style.zIndex = "9999";
        downloadAllBtn.style.padding = "10px";
        downloadAllBtn.style.borderRadius = "20px";
        downloadAllBtn.style.backgroundColor = "#0095f6";
        downloadAllBtn.style.color = "white";
        downloadAllBtn.style.border = "none";

        downloadAllBtn.onclick = function() {
            const posts = document.querySelectorAll('article');
            let count = 0;
            posts.forEach(post => {
                const mediaUrl = getMediaUrl(post);
                if (mediaUrl && window.AndroidBridge) {
                    window.AndroidBridge.downloadMedia(mediaUrl, null);
                    count++;
                }
            });
            // Also try to find media in the grid if articles are not fully loaded as articles
            if (count === 0) {
                const gridItems = document.querySelectorAll('div._aabd, div._aahy');
                gridItems.forEach(item => {
                    const mediaUrl = getMediaUrl(item);
                    if (mediaUrl && window.AndroidBridge) {
                        window.AndroidBridge.downloadMedia(mediaUrl, null);
                        count++;
                    }
                });
            }
            alert("Triggered " + count + " downloads");
        };

        document.body.appendChild(downloadAllBtn);
    }

    setInterval(() => {
        injectPostButtons();
        if (window.location.href.includes('instagram.com/') && !window.location.href.includes('/p/') && !window.location.href.includes('/reels/')) {
            injectDownloadAllButton();
        }
    }, 3000);
})();
