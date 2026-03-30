# Dashrobe Shop Configuration & Assisted Commerce

## Overview

This comprehensive module provides vendors with advanced operational controls for managing their marketplace presence. The system is designed to feel like **Blinkit meets Shopify** - fast, real-time, and operationally powerful.

## Key Features

### 1. Live Commerce & Video Call
**Location:** Shop Configuration → Live Commerce & Video Call

Enable video shopping experiences for customers:
- Toggle video call availability
- Set pricing (Free or Paid per-minute)
- Configure session duration limits
- Auto-accept calls option
- Weekly time slot management
- Platform commission: 15%
- Earnings preview calculator

**Use Case:** Fashion retailers can offer virtual shopping sessions, helping customers select outfits remotely.

### 2. Try & Buy (SKU-Level Control)
**Location:** Shop Configuration → Try & Buy

Allow customers to try products before purchasing:
- Global toggle with SKU-level overrides
- Set max try items per order (1-5)
- Configure refund deduction rules
- Auto inventory reversal on returns
- Integrated into Product Edit → Variant table

**Use Case:** Apparel stores can let customers try multiple sizes at home, keeping what fits.

### 3. Assisted Cart (Salesman Mode)
**Location:** Shop Configuration → Assisted Cart

POS-style interface for in-store assisted shopping:
- Quick product search
- Variant selector
- Apply store-level offers
- Customer lookup or walk-in checkout
- Touch-friendly interface

**Use Case:** Physical store staff can help walk-in customers browse and checkout seamlessly.

### 4. Scheduled Orders
**Location:** Shop Configuration → Scheduled Orders

Accept orders with future delivery dates:
- Toggle scheduled order acceptance
- Set preparation buffer time
- Max orders per time slot
- Visual slot availability calendar
- Dashboard widget for upcoming orders

**Use Case:** Bakeries or custom product stores can take pre-orders for specific dates.

### 5. Order Alert System
**Location:** Shop Configuration → Order Alert System

Multi-channel notification system:
- Siren sound (adjustable volume)
- Vibration feedback
- Push notifications
- SMS alerts
- WhatsApp alerts
- Test alert button
- Master "Accept Orders" toggle

**Use Case:** Never miss an order with customizable alerts across all your devices.

### 6. SOS & Emergency
**Location:** Floating button (bottom-right) + Shop Configuration

Quick access to emergency support:
- Red floating SOS button
- Instant alert to operations team
- Issue categorization
- Emergency contact management

**Use Case:** Report safety concerns, system failures, or urgent operational issues.

### 7. Picker Assignment
**Location:** Shop Configuration → Picker Assignment

Manage order fulfillment workflow:
- Auto-assign or manual picker assignment
- Edit picker for active orders
- Integrated into order detail screens
- Picker avatar and reassign modal

**Use Case:** Warehouse managers can optimize order picking by assigning the right person.

### 8. Profile Picture Cropper
**Location:** Shop Configuration → Profile Picture

Upload and manage shop profile image:
- Drag & drop upload
- 1:1 ratio enforcement
- Zoom and crop tools
- Live circular preview
- Visible in sidebar and customer-facing pages

**Use Case:** Maintain professional branding with perfectly cropped profile pictures.

## Dashboard Real-Time States

The dashboard displays live operational indicators:

### Alert States
1. **New Order Incoming** - Yellow pulsing badge with bell animation
2. **Active Video Call** - Green indicator with live timer
3. **Scheduled Orders** - Blue badge showing count for today
4. **Shop Status** - Green (Online) or Red (Offline) indicator
5. **Low Inventory** - Orange warning banner
6. **Delayed Orders** - Red timer badge

### Notifications
- Dropdown accessible from top-right bell icon
- Unread count badge
- Real-time notifications for:
  - New orders
  - Delayed orders
  - Low stock alerts
  - Successful deliveries

## Navigation

### Sidebar Menu
- Dashboard
- Products
- Campaigns
- Ads
- Orders
- Offers
- Delivery
- Video Calls
- **Shop Configuration** ← New module
- Subscription
- Settings

### Quick Actions
- SOS button (always visible, bottom-right)
- Notification dropdown (top-right)
- Profile menu (top-right)

## Design System

### Colors
- Primary: `#220E92` (Deep Royal Purple)
- Accent: `#FFC100` (Vibrant Yellow)
- Success: Green
- Warning: Orange/Yellow
- Error: Red

### Typography
- Font: Geist (system default)
- Hierarchy maintained throughout

### Components
- Card radius: 12px
- Button radius: 10px
- Soft shadows for depth
- Strong whitespace for clarity
- Hover states and micro-interactions

## Micro-Interactions

1. **Toggle Switches** - Smooth slide animation with color transition
2. **Alert Animations** - Pulse and ping effects for urgency
3. **Hover States** - Subtle background changes on interactive elements
4. **Modal Entry** - Fade-in with scale animation
5. **Notification Badge** - Animate-pulse for unread items

## Best Practices

### Order Management
1. Keep "Accept Orders" ON during business hours
2. Configure alert preferences to avoid missing orders
3. Use "Shop Offline" toggle during breaks

### Video Commerce
1. Set realistic session durations
2. Update time slots weekly based on availability
3. Test call quality before enabling

### Inventory
1. Enable Try & Buy for apparel and accessories
2. Monitor low stock alerts actively
3. Use auto inventory reversal for efficiency

### Customer Experience
1. Use Assisted Cart for walk-in customers
2. Enable scheduled orders for advance bookings
3. Respond to video call requests promptly

## Technical Notes

- All settings are saved in real-time
- Toggle states persist across sessions
- Notifications work cross-device
- SOS alerts are highest priority

## Support

For assistance:
- Email: support@dashrobe.com
- SOS Button: Immediate escalation
- Help sections within each module

---

**Version:** 1.0.0  
**Last Updated:** February 17, 2026  
**Platform:** Dashrobe Vendor Dashboard
