const API_URL = "http://localhost:5000";

async function registerUser(user) {
    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('User registered successfully:', data);
        await getAllUsers();
        return data;
    } catch (error) {
        console.error('Error registering user:', error.message);
        throw error;
    }
}

async function getAllUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('All users:', data);
        displayUsers(data);
        return data;
    } catch (error) {
        console.error('Error fetching users:', error.message);
        throw error;
    }
}

async function getSingleUser(id) {
    try {
        const response = await fetch(`${API_URL}/users/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Single user:', data);
        displaySingleUser(data);
        return data;
    } catch (error) {
        console.error('Error fetching user:', error.message);
        throw error;
    }
}

async function deleteUser(user_id) {
    if (confirm("Are you sure you want to delete this user?")) {
        try {
            const response = await fetch(`${API_URL}/users/${user_id}`, { method: 'DELETE' });
            if (response.ok) {
                alert("User deleted successfully!");
                await getAllUsers();
            } else {
                throw new Error("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error.message);
            alert("An error occurred while deleting the user.");
        }
    }
}

function displaySingleUser(user) {
    const userList = document.getElementById('userList');
    userList.innerHTML = `
        <small id="back-btn" onclick="getAllUsers()">Back</small>
        <h1>${user.name}</h1>
        <p>Email: ${user.email}</p>
        <p>Age: ${user.age} years</p>
        <p>Weight: ${user.weight} kg</p>
        <p>Height: ${user.height} cm</p>
        <p>Health Goals: ${user.healthGoals}</p>
        <button class="dlt-btn" onclick="deleteUser('${user.id}')">Delete</button>
        <button class="upd-btn" onclick="updateUserForm('${user.id}')">Update</button>
    `;
}

async function updateUserForm(u_id) {
    try {
        const response = await fetch(`${API_URL}/users/${u_id}`);
        if (!response.ok) throw new Error('User not found');
        const data = await response.json();

        const updateTab = document.getElementById('userUpdate');
        updateTab.innerHTML = `
            <h2>Update user</h2>
            <form id='updateForm'>
                <input type="text" id="uname" value="${data.name}" required />
                <input type="email" id="uemail" value="${data.email}" required />
                <input type="number" id="uage" value="${data.age}" required />
                <input type="number" id="uweight" value="${data.weight}" required />
                <input type="number" id="uheight" value="${data.height}" required />
                <input type="text" id="uhealthGoals" value="${data.healthGoals}" required />
                <input type="hidden" id="uid" value="${u_id}" />
                <button type="submit" class="upd-btn">Update</button>
            </form>
        `;

        const updForm = document.getElementById('updateForm');
        updForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userData = {
                name: document.getElementById('uname').value,
                email: document.getElementById('uemail').value,
                age: parseInt(document.getElementById('uage').value, 10),
                weight: parseFloat(document.getElementById('uweight').value),
                height: parseFloat(document.getElementById('uheight').value),
                healthGoals: document.getElementById('uhealthGoals').value,
            };
            const update_uid = document.getElementById('uid').value;
            try {
                await updateuser(update_uid, userData);
                await getSingleUser(update_uid);
            } catch (error) {
                console.log(error.message);
                alert('Error updating user!');
            }
        });
    } catch (error) {
        console.log(error.message);
        alert('User not found!');
    }
}


async function updateuser(u_id, userdata) {
    try {
        const response = await fetch(`${API_URL}/users/edit/${u_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userdata),  // Send user data in the request body
        });

        if (!response.ok) {
            throw new Error(`Failed to update user, status: ${response.status}`);
        }

        alert('User updated successfully!');
        await getSingleUser(u_id);
    } catch (error) {
        console.log(error.message);
        alert('Error updating user!');
    }
}




function displayUsers(users) {
    const userList = document.getElementById('userList');
    document.getElementById('userUpdate').innerHTML = '';
    userList.innerHTML = '<h2>User List</h2>';
    if(users.length>0){
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.name} (${user.email})`;
        li.addEventListener('click', () => getSingleUser(user.id));
        userList.appendChild(li);
    });
    }
    else{
        const li = document.createElement('li');
        li.textContent = "There are no users on database!";
        userList.appendChild(li);
    }
}

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const updForm = document.getElementById('updateForm');
    if(updForm){
        updForm.addEventListener('submit', async (e)=>{
            e.preventDefault();
            const userData= {
                name: document.getElementById('uname').value,
                email: document.getElementById('uemail').value,
                age: parseInt(document.getElementById('uage').value, 10),
                weight: parseFloat(document.getElementById('uweight').value),
                height: parseFloat(document.getElementById('uheight').value),
                healthGoals: document.getElementById('uhealthGoals').value
            }
            const update_uid = document.getElementById('uid').value
            try {
                await updateuser(uid, userData)
                alert("User updated successfully!")
            } catch (error) {
                console.log(error.message)
                alert("Error updating user!")
            }
        })
    }

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userData = {
                id: generateUniqueId(),
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                age: parseInt(document.getElementById('age').value, 10),
                weight: parseFloat(document.getElementById('weight').value),
                height: parseFloat(document.getElementById('height').value),
                healthGoals: document.getElementById('healthGoals').value
            };

            try {
                await registerUser(userData);
                form.reset(); 
                alert('User registered successfully!');
            } catch (error) {
                alert('Error registering user: ' + error.message);
            }
        });
    } else {
        console.error('Registration form not found in the DOM');
    }

    try {
        await getAllUsers();
    } catch (error) {
        console.error('Error loading users:', error);
    }
});