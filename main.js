const API_URL = "https://jsonplaceholder.typicode.com/users";
let isFix = null;

async function getUsers() {
    try {
        const respone = await axios.get(API_URL);

        renderTable(respone.data);
    } catch (error) {
        console.log("Lỗi lấy dữ lệu: ", error);
        alert("KHÔNG TẢI ĐƯỢC DỮ LIỆU!");
    }

}

function renderTable(users){
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = `
            <tr id = "row-${user.id}">
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>
                    <button onclick="editUser(${user.id})">Edit</button>
                    <button onclick="deleteUser(${user.id})">Delete</button> 
                </td>
            </tr>
        `
        tableBody.innerHTML += row;
    });
}

getUsers();
async function createUser() { 
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    if (!name || !email){
        alert("Thiếu thông tin!");
        retunr
    }

    try {

        if (!isFix) {
            const respone = await axios.post(API_URL, {
                name: name,
                email: email,
                phone: phone
            });

        }

        console.log(respone.data);

        const newUser = respone.data;
        appendUser(newUser);

        alert("Theem thanhf coong!");

        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phone").value = "";
    } catch (error) {
        // Slide 49: Xử lý lỗi (console.log hoặc alert)
        console.error("Lỗi khi thêm user:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
}

function appendUser(user) {
    const tableBody = document.getElementById("userTableBody");

    const newRow = `
        <tr id = "row-${user.id}">
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </td>
        </tr>
    `
    tableBody.innerHTML += newRow;
}
async function deleteUser(id) { 
    try {
        const url = `${API_URL}/${id}`;
        const response = await axios.delete(url);

        console.log(response);

        if (response.status === 200 || response.status === 204 ) {
            deleteUIUser(id);
        }
    } catch(err){
        console.log("Có lỗi khi xóa: ", err);
        alert("Lỗi khi xóa!");
    }
}

function deleteUIUser(id) {
    const userRow = document.getElementById(`row-${id}`);
    if (!userRow) {
        alert("Không phát hiện id user! Hãy xem lại!");
        return;
    }
    userRow.remove();
}
async function editUser(id) { 
    try {
        const url = `${API_URL}/${id}`;
        const response = await axios.get(url);

        const user = response.data;

        document.getElementById("name").value = user.name;
        document.getElementById("email").value = user.email;
        document.getElementById("phone").value = user.phone;
    }
}
async function searchUser() { console.log("Đang tìm kiếm..."); }