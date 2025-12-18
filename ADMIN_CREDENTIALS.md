# 🛡️ Greenify Admin Access

## Built-in Administrator Account

The Greenify platform includes a built-in administrator account that is automatically created when the system starts.

### **Admin Credentials:**
- **Email:** `admin@greenify.com`
- **Password:** `GreenifyAdmin2024!`

### **Admin Features:**
- Activity verification and approval/rejection
- User management and analytics
- Rewards system management
- Platform statistics and monitoring
- System health dashboard

### **Security Notes:**
- The admin account is created automatically on first database connection
- Change the default password in production environments
- Admin credentials are defined in `/app/lib/initAdmin.ts`
- Only one built-in admin account exists per system

### **Access:**
1. Go to the login page: `http://localhost:3000/login`
2. Enter the admin credentials above
3. You'll be automatically redirected to the admin dashboard

---

**⚠️ Important:** In production, make sure to change the default admin password and use environment variables for sensitive credentials.
