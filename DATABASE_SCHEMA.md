# Zohar Media Admin - Database Schema

This document outlines the database schema for the Zohar Media Admin application based on the implemented features and data structures.

## Overview

The database is designed to support a comprehensive media management system with team management, portfolio management, client inquiries, and analytics tracking.

## Database Tables

### 1. Users & Authentication

#### `users`

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- admin, manager, editor
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Team Management

#### `team_members`

```sql
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    bio TEXT,
    join_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, inactive
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `team_member_skills`

```sql
CREATE TABLE team_member_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `team_member_social_links`

```sql
CREATE TABLE team_member_social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- linkedin, twitter, instagram
    url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Portfolio Management

#### `portfolio_categories`

```sql
CREATE TABLE portfolio_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) NOT NULL, -- hex color code
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `portfolio_items`

```sql
CREATE TABLE portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES portfolio_categories(id),
    thumbnail_url TEXT,
    client_name VARCHAR(255),
    project_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'completed', -- completed, in-progress, draft
    featured BOOLEAN DEFAULT false,
    project_url TEXT,
    testimonial TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `portfolio_item_images`

```sql
CREATE TABLE portfolio_item_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `portfolio_item_tags`

```sql
CREATE TABLE portfolio_item_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `portfolio_item_technologies`

```sql
CREATE TABLE portfolio_item_technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE CASCADE,
    technology_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `portfolio_item_team_members`

```sql
CREATE TABLE portfolio_item_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE CASCADE,
    team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
    role VARCHAR(100), -- optional role for this specific project
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(portfolio_item_id, team_member_id)
);
```

### 4. Client Management

#### `inquiries`

```sql
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    inquiry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'unread', -- unread, responded, resolved
    type VARCHAR(50) DEFAULT 'general', -- general, collaboration, pricing, support
    assigned_to UUID REFERENCES team_members(id),
    response TEXT,
    response_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `testimonials`

```sql
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    message TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    testimonial_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    featured BOOLEAN DEFAULT false,
    avatar_url TEXT,
    portfolio_item_id UUID REFERENCES portfolio_items(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Media Management

#### `media_items`

```sql
CREATE TABLE media_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL, -- image, video
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_size VARCHAR(20), -- e.g., "2.4 MB"
    dimensions VARCHAR(20), -- e.g., "1920x1080"
    duration VARCHAR(10), -- e.g., "2:15" for videos
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `media_item_tags`

```sql
CREATE TABLE media_item_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_item_id UUID REFERENCES media_items(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Analytics & Statistics

#### `analytics_data`

```sql
CREATE TABLE analytics_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    visitors_today INTEGER DEFAULT 0,
    visitors_this_week INTEGER DEFAULT 0,
    visitors_this_month INTEGER DEFAULT 0,
    visitor_trend DECIMAL(5,2) DEFAULT 0, -- percentage change
    inquiries_total INTEGER DEFAULT 0,
    inquiries_this_month INTEGER DEFAULT 0,
    inquiry_trend DECIMAL(5,2) DEFAULT 0, -- percentage change
    media_total_views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date)
);
```

#### `business_statistics`

```sql
CREATE TABLE business_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    completed_projects INTEGER DEFAULT 0,
    happy_clients INTEGER DEFAULT 0,
    perspective_clients INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    average_project_value DECIMAL(10,2) DEFAULT 0,
    is_public BOOLEAN DEFAULT true, -- whether to show on public website
    auto_update BOOLEAN DEFAULT true, -- auto-update from completed projects
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. System Configuration

#### `system_settings`

```sql
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) DEFAULT 'Zohar Media',
    business_description TEXT,
    industry VARCHAR(100),
    website_url TEXT,
    contact_email VARCHAR(255),
    theme VARCHAR(20) DEFAULT 'light', -- light, dark
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `activity_logs`

```sql
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- created, updated, deleted, etc.
    entity_type VARCHAR(50) NOT NULL, -- portfolio_item, team_member, etc.
    entity_id UUID,
    description TEXT,
    metadata JSONB, -- additional data about the action
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes

### Performance Indexes

```sql
-- Team members
CREATE INDEX idx_team_members_status ON team_members(status);
CREATE INDEX idx_team_members_email ON team_members(email);

-- Portfolio items
CREATE INDEX idx_portfolio_items_category ON portfolio_items(category_id);
CREATE INDEX idx_portfolio_items_status ON portfolio_items(status);
CREATE INDEX idx_portfolio_items_featured ON portfolio_items(featured);
CREATE INDEX idx_portfolio_items_project_date ON portfolio_items(project_date);

-- Inquiries
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_type ON inquiries(type);
CREATE INDEX idx_inquiries_date ON inquiries(inquiry_date);
CREATE INDEX idx_inquiries_assigned_to ON inquiries(assigned_to);

-- Testimonials
CREATE INDEX idx_testimonials_status ON testimonials(status);
CREATE INDEX idx_testimonials_featured ON testimonials(featured);
CREATE INDEX idx_testimonials_rating ON testimonials(rating);

-- Media items
CREATE INDEX idx_media_items_type ON media_items(type);
CREATE INDEX idx_media_items_upload_date ON media_items(upload_date);

-- Analytics
CREATE INDEX idx_analytics_data_date ON analytics_data(date);
```

## Relationships Summary

1. **Team Members** → **Portfolio Items** (Many-to-Many via `portfolio_item_team_members`)
2. **Portfolio Categories** → **Portfolio Items** (One-to-Many)
3. **Portfolio Items** → **Testimonials** (One-to-Many)
4. **Team Members** → **Inquiries** (One-to-Many, assigned_to)
5. **Users** → **Activity Logs** (One-to-Many)

## Data Types Used

- **UUID**: Primary keys for all tables
- **VARCHAR**: Text fields with appropriate length limits
- **TEXT**: Long text content (descriptions, messages)
- **TIMESTAMP**: Date and time fields
- **DATE**: Date-only fields
- **BOOLEAN**: True/false flags
- **INTEGER**: Counters and ratings
- **DECIMAL**: Monetary values and percentages
- **JSONB**: Flexible data storage for metadata

## Sample Data Population

The application includes sample data that can be used to populate the database for development and testing purposes. All sample data is defined in `src/data/sample-data.ts` and includes:

- 5 team members with various roles and skills
- 5 portfolio categories with different colors
- 5 portfolio items across different categories
- 5 client inquiries with different statuses
- 5 testimonials with ratings
- 6 media items (images and videos)
- Analytics data with visitor and inquiry trends
- Business statistics with the requested numbers (230 completed projects, 1,068 happy clients, 230 perspective clients)

## Migration Strategy

1. Create all tables in the order specified (respecting foreign key dependencies)
2. Create indexes after table creation
3. Insert sample data for development
4. Set up proper constraints and triggers for data integrity
5. Configure backup and maintenance procedures

This schema supports all the features implemented in the Zohar Media Admin application and provides a solid foundation for future enhancements.
