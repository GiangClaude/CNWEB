const API_URL = "https://jsonplaceholder.typicode.com/users";
let isFix = null;

let currentPage = 1;
const limit = 3; 
async function getUsers() {
    try {
        // Lấy từ khóa tìm kiếm hiện tại
        const keyword = document.getElementById("searchBox").value;

        let url = `${API_URL}?_page=${currentPage}&_limit=${limit}`;
        
        if (keyword) {
            url += `&name_like=${keyword}`;
        }

        const response = await axios.get(url);

        // Cập nhật số trang hiển thị
        document.getElementById("pageIndicator").innerText = `Page ${currentPage}`;
        
        renderTable(response.data);

    } catch (error) {
        console.log("Lỗi lấy dữ liệu: ", error);
        alert("KHÔNG TẢI ĐƯỢC DỮ LIỆU!");
    }
}

async function searchUser() {
    currentPage = 1; 
    getUsers();
}

async function changePage(step) {
    // step = 1 (Next) hoặc -1 (Prev)
    const newPage = currentPage + step;
    
    // Chặn không cho lùi về trang 0
    if (newPage < 1) return; 

    currentPage = newPage;
    getUsers();
}


function renderTable(users){
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = '';

    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">Không tìm thấy kết quả nào!</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = `
            <tr id="row-${user.id}">
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>
                    <button onclick="editUser(${user.id})">Edit</button>
                    <button onclick="deleteUser(${user.id})">Delete</button> 
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

async function handleForm() { 
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    if (!name || !email){
        alert("Thiếu thông tin!");
        return;
    }

    try {
        if (isFix === null) {
            const response = await axios.post(API_URL, {
                name: name, email: email, phone: phone
            });
            appendUser(response.data); 
            alert("Thêm thành công!");
        } else {
            const url = `${API_URL}/${isFix}`;
            const response = await axios.put(url, {
                name: name, email: email, phone: phone
            });
            
            const user = response.data; 
            user.id = isFix; 
            
            updateUIUser(user); 
            alert("Sửa thành công!");
            isFix = null;
        }
        
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phone").value = "";

    } catch (error) {
        console.error("Lỗi form:", error);
        alert("Có lỗi xảy ra!");
    }
}

function appendUser(user) {
    const tableBody = document.getElementById("userTableBody");
    const newRow = `
        <tr id="row-${user.id}">
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </td>
        </tr>
    `;
    tableBody.innerHTML += newRow;
}

function updateUIUser(user) {
    const userRow = document.getElementById(`row-${user.id}`);
    if (userRow) {
        userRow.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button> 
            </td>
        `;
    }
}

async function deleteUser(id) { 
    if(!confirm("Bạn chắc chắn muốn xóa chứ?")) return; // Thêm xác nhận cho an toàn
    try {
        const url = `${API_URL}/${id}`;
        const response = await axios.delete(url);

        if (response.status === 200 || response.status === 204 ) {
            const userRow = document.getElementById(`row-${id}`);
            if (userRow) userRow.remove();
        }
    } catch(err){
        console.log("Có lỗi khi xóa: ", err);
        alert("Lỗi khi xóa!");
    }
}

async function editUser(id) { 
    try {
        const url = `${API_URL}/${id}`;
        const response = await axios.get(url);
        const user = response.data;

        document.getElementById("name").value = user.name;
        document.getElementById("email").value = user.email;
        document.getElementById("phone").value = user.phone;

        isFix = id;
    } catch(err){
        alert("Không lấy được thông tin user để sửa!");
    }
}

getUsers();