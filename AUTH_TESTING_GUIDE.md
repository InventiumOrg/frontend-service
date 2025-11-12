# 🔍 Authentication Testing Guide

## Current Issue
The system is getting "Invalid or expired token" errors because it's trying to use hardcoded environment tokens instead of the actual Clerk session tokens.

## What Changed
✅ **Server-side auth** now reads from `__session` cookie (Clerk's default)  
✅ **Client-side auth** now reads from cookies instead of environment  
✅ **Fallback system** checks multiple token sources  
✅ **Debug tools** to help identify authentication issues  

## How to Test

### 1. Sign In Through Clerk
1. Visit `/sign-in`
2. Sign in with your Clerk account
3. This should create a `__session` cookie

### 2. Debug Authentication
Visit `/auth-debug` to see:
- Clerk authentication status
- Available cookies
- Token information
- Server-side auth testing

### 3. Check Console Logs
Look for these messages:
- ✅ `Using __session cookie token` - Good!
- ✅ `Using Clerk session token` - Good!
- ❌ `No authentication token found` - Problem!

### 4. Test Inventory Access
After signing in, visit `/inventory` to see if it works with the session token.

## Expected Token Sources (in order of preference)

### Server-side (`getServerAuthToken`)
1. **Clerk session token** - `await auth().getToken()`
2. **__session cookie** - Clerk's default session cookie
3. **auth_token cookie** - Legacy fallback

### Client-side (`getAuthToken`)
1. **__session cookie** - Clerk's default session cookie
2. **auth_token cookie** - Legacy fallback
3. **localStorage** - Development/testing only

## Debugging Commands

### Browser Console
```javascript
// Debug client authentication
debugClientAuth()

// Check cookies manually
document.cookie.split(';').forEach(c => console.log(c.trim()))
```

### Server Logs
Look for these debug messages:
- `🔍 Server-side auth debug`
- `✅ Using __session cookie token`
- `❌ No authentication token found`

## Common Issues & Solutions

### Issue: "No authentication token found"
**Solution:** Make sure you're signed in through Clerk (`/sign-in`)

### Issue: "Invalid or expired token"
**Solution:** Sign out and sign back in to refresh the session

### Issue: "Clerk middleware not run"
**Solution:** Make sure `src/middleware.ts` exists and is properly configured

### Issue: Cookies not being set
**Solution:** Check if you're on the correct domain and HTTPS is configured properly

## Next Steps

1. **Test the sign-in flow** - Visit `/sign-in` and authenticate
2. **Check the debug page** - Visit `/auth-debug` to see token status
3. **Test inventory access** - Visit `/inventory` after signing in
4. **Check console logs** - Look for authentication debug messages

The system should now use real Clerk session tokens instead of hardcoded environment tokens! 🎯