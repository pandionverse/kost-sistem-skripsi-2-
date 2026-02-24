const API_URL = 'http://localhost:5000/api';
let ownerToken = '';
let adminToken = '';
let ownerId = '';

const runTest = async () => {
    try {
        console.log('--- STARTING RBAC TEST ---');

        // Helper for fetch
        const post = async (url, data, token) => {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['x-auth-token'] = token;
            const res = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || res.statusText);
            }
            return await res.json();
        };

        const get = async (url, token) => {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['x-auth-token'] = token;
            const res = await fetch(url, { headers });
            return await res.json();
        };

        const put = async (url, data, token) => {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['x-auth-token'] = token;
            const res = await fetch(url, {
                method: 'PUT',
                headers,
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || res.statusText);
            }
            return await res.json();
        };

        // 1. Register Owner
        const ownerEmail = `owner_${Date.now()}@test.com`;
        console.log(`1. Registering Owner (${ownerEmail})...`);
        try {
            await post(`${API_URL}/auth/register`, {
                name: 'Test Owner',
                email: ownerEmail,
                password: 'password123',
                role: 'owner'
            });
            console.log('   Owner Registered.');
        } catch (e) {
            console.log('   Owner might already exist, trying login.');
        }

        // 2. Login Owner
        console.log('2. Logging in Owner...');
        const loginRes = await post(`${API_URL}/auth/login`, {
            email: ownerEmail,
            password: 'password123'
        });
        ownerToken = loginRes.token;
        ownerId = loginRes.user.id;
        console.log('   Owner Logged In. Role:', loginRes.user.role);

        // 3. Create Kost (Pending)
        console.log('3. Owner Creating Kost...');
        const kostRes = await post(`${API_URL}/kost`, {
            name: 'Kost Test RBAC',
            description: 'Testing',
            price: 1000000,
            address: 'Jl. Test No. 1',
            latitude: 0,
            longitude: 0,
            owner_phone: '08123456789'
        }, ownerToken);
        const kostId = kostRes.kostId;
        console.log('   Kost Created. ID:', kostId);

        // 4. Verify Kost is Pending (Public Search shouldn't see it)
        console.log('4. Verifying Kost Status (Public)...');
        const publicRes = await get(`${API_URL}/kost?search=Kost Test RBAC`);
        const foundPublic = publicRes.find(k => k.id === kostId);
        if (!foundPublic) {
            console.log('   SUCCESS: Kost NOT found in public search (Pending).');
        } else {
            console.error('   FAILURE: Kost FOUND in public search!');
        }

        // 5. Login Admin
        const adminEmail = `admin_${Date.now()}@test.com`;
        console.log(`5. Registering Admin (${adminEmail})...`);
        try {
            await post(`${API_URL}/auth/register`, {
                name: 'Test Admin',
                email: adminEmail,
                password: 'password123',
                role: 'admin'
            });
        } catch (e) { }

        const adminLogin = await post(`${API_URL}/auth/login`, {
            email: adminEmail,
            password: 'password123'
        });
        adminToken = adminLogin.token;
        console.log('   Admin Logged In.');

        // 6. Admin Approves Kost
        console.log('6. Admin Approving Kost...');
        await put(`${API_URL}/admin/kost/${kostId}/approve`, {}, adminToken);
        console.log('   Kost Approved.');

        // 7. Verify Kost is Approved (Public Search SHOULD see it)
        console.log('7. Verifying Kost Status (Public)...');
        const publicRes2 = await get(`${API_URL}/kost?search=Kost Test RBAC`);
        const foundPublic2 = publicRes2.find(k => k.id === kostId);
        if (foundPublic2) {
            console.log('   SUCCESS: Kost FOUND in public search (Approved).');
        } else {
            console.error('   FAILURE: Kost NOT found in public search!');
        }

        console.log('--- TEST COMPLETED ---');

    } catch (error) {
        console.error('TEST FAILED:', error);
    }
};

runTest();
