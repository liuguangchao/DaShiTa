/* ========== 路由系统 ========== */
class Router {
    constructor() {
        this.pages = {};
        this.currentPage = null;
        this.history = [];
    }

    registerPage(pageId, pageElement) {
        this.pages[pageId] = pageElement;
        pageElement.style.display = 'none';
    }

    navigateTo(pageId) {
        if (this.currentPage && this.currentPage !== this.pages[pageId]) {
            this.history.push(this.currentPage);
        }

        // 隐藏当前页
        if (this.currentPage) {
            this.currentPage.style.display = 'none';
        }

        // 显示目标页
        const page = this.pages[pageId];
        if (page) {
            page.style.display = 'block';
            this.currentPage = page;
        }
    }

    goBack() {
        if (this.history.length > 0) {
            const prevPage = this.history.pop();
            if (this.currentPage) {
                this.currentPage.style.display = 'none';
            }
            prevPage.style.display = 'block';
            this.currentPage = prevPage;
        }
    }

    getCurrentPage() {
        return this.currentPage;
    }
}

// 创建全局路由器实例
const router = new Router();

/* ========== 工具函数 ========== */
function showAlert(message, callback) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 30px;
        max-width: 300px;
        text-align: center;
    `;
    dialog.innerHTML = `
        <p style="margin-bottom: 20px; font-size: 16px; color: #333;">${message}</p>
        <button onclick="this.closest('div').parentElement.remove();" style="
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: white;
            border: none;
            border-radius: 20px;
            padding: 12px 40px;
            font-size: 16px;
            cursor: pointer;
        ">确定</button>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}

function showConfirm(message, onConfirm, onCancel) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 30px;
        max-width: 300px;
        text-align: center;
    `;
    dialog.innerHTML = `
        <p style="margin-bottom: 20px; font-size: 16px; color: #333;">${message}</p>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="confirmCancel" style="
                background: #ddd;
                color: #666;
                border: none;
                border-radius: 20px;
                padding: 12px 30px;
                font-size: 16px;
                cursor: pointer;
            ">取消</button>
            <button id="confirmOk" style="
                background: linear-gradient(135deg, #FFD700, #FFA500);
                color: white;
                border: none;
                border-radius: 20px;
                padding: 12px 30px;
                font-size: 16px;
                cursor: pointer;
            ">确定</button>
        </div>
    `;

    document.getElementById('confirmCancel').addEventListener('click', () => {
        overlay.remove();
        if (onCancel) onCancel();
    });

    document.getElementById('confirmOk').addEventListener('click', () => {
        overlay.remove();
        if (onConfirm) onConfirm();
    });

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}
