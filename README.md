# Soumita Space - Admin Panel

A simple, clean admin panel for managing the Soumita Space website content.

## 🚀 Features

- **Secure Login**: Simple authentication system
- **Live Preview**: See changes in real-time
- **Section Management**: Edit hero, about, experience, skills, testimonials, and contact sections
- **Dynamic Content**: Add/remove experience items, skills, and testimonials
- **Color Customization**: Change website colors
- **Responsive Design**: Works on desktop and mobile

## 🔐 Login Credentials

- **Username**: `admin`
- **Password**: `soumita2024`

## 📁 File Structure

```
├── index.html          # Main website
├── admin.html          # Admin panel interface
├── admin.css           # Admin panel styles
├── admin.js            # Admin panel functionality
└── README.md           # This file
```

## 🛠️ How to Use

### 1. Access Admin Panel
- Navigate to `admin.html` in your browser
- Enter the login credentials
- You'll see the admin interface

### 2. Edit Content
- Use the sidebar to navigate between sections
- Edit text fields, add/remove items
- Changes are saved to localStorage automatically

### 3. Preview Changes
- Click the "Preview" button to see changes in a modal
- The preview shows the actual website with your changes

### 4. Save Changes
- Click "Save Changes" to persist your edits
- Data is stored in browser localStorage

## 📱 Sections Available

### Hero Section
- Greeting text
- Name
- Subtitle
- Description
- Profile image URL

### About Section
- Section title
- Section description
- About text content

### Experience Section
- Add/remove experience items
- Edit job title, company, dates, and descriptions

### Skills Section
- Add/remove skills
- Set skill percentages
- Currently supports "Admissions & Immigration" category

### Testimonials Section
- Add/remove testimonials
- Edit client names, titles, and quotes

### Contact Section
- Email address
- LinkedIn URL
- Location

### Settings
- Website title
- Primary, secondary, and accent colors

## 🔧 Technical Details

### Security
- Simple client-side authentication
- Data stored in localStorage
- For production, implement proper backend authentication

### Data Storage
- All data is stored in browser localStorage
- Data persists between sessions
- Can be exported/imported manually

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Responsive design for mobile devices

## 🚀 Deployment

### Vercel Deployment
1. Upload all files to your Vercel project
2. Set up custom domain if needed
3. Access admin panel at `yourdomain.com/admin.html`

### Security Considerations
- Change default login credentials
- Consider implementing proper backend authentication
- Add rate limiting for login attempts
- Use HTTPS in production

## 🔄 Future Enhancements

### Phase 2 Features (To Be Added)
- [ ] Rich text editor (TinyMCE)
- [ ] Google Fonts integration
- [ ] Image upload functionality
- [ ] Drag & drop interface
- [ ] Advanced color picker
- [ ] Backup/restore functionality
- [ ] User management
- [ ] Activity logging

### Phase 3 Features
- [ ] Backend integration
- [ ] Database storage
- [ ] Real-time collaboration
- [ ] Version history
- [ ] Advanced security

## 🐛 Troubleshooting

### Common Issues

**Can't access admin panel?**
- Check if `admin.html` exists in your project
- Ensure JavaScript is enabled
- Clear browser cache and try again

**Changes not saving?**
- Check browser console for errors
- Ensure localStorage is available
- Try refreshing the page

**Preview not working?**
- Make sure `index.html` is in the same directory
- Check if iframe is blocked by browser
- Verify both files are served from same domain

## 📞 Support

For issues or questions:
- Check browser console for error messages
- Verify all files are properly uploaded
- Test in different browsers

---

**Note**: This is a simple admin panel for basic content management. For production use, consider implementing proper security measures and backend integration. 