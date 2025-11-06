CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    totp_secret TEXT,
    totp_enabled BOOLEAN DEFAULT FALSE,
    role_id UUID REFERENCES roles(id),
    timezone TEXT DEFAULT 'Asia/Kolkata',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    content TEXT NOT NULL,
    effective_from DATE,
    obsolete_on DATE,
    lifecycle TEXT NOT NULL,
    acknowledgements JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(document_id, version)
);

CREATE TABLE controlled_copies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_version_id UUID REFERENCES document_versions(id) ON DELETE CASCADE,
    issued_to TEXT NOT NULL,
    qr_token TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE register_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    stack TEXT NOT NULL,
    schema JSONB NOT NULL,
    workflow JSONB NOT NULL,
    retention JSONB NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE register_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    definition_id UUID REFERENCES register_definitions(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    status TEXT NOT NULL,
    signatures JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    identifier TEXT UNIQUE NOT NULL,
    commission_date DATE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    in_service BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE calibrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
    performed_on DATE NOT NULL,
    next_due DATE NOT NULL,
    certificate JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE occurrences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    root_cause JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE capas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    occurrence_id UUID REFERENCES occurrences(id) ON DELETE CASCADE,
    action_plan JSONB NOT NULL,
    due_date DATE,
    closed_on DATE,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope TEXT NOT NULL,
    planned_on DATE NOT NULL,
    checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
    findings JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE mrm_minutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_date DATE NOT NULL,
    agenda JSONB NOT NULL DEFAULT '[]'::jsonb,
    actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE retention_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_type TEXT NOT NULL,
    retention_months INTEGER NOT NULL,
    legal_hold BOOLEAN DEFAULT FALSE,
    archival_targets JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE archival_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    archived_at TIMESTAMP WITH TIME ZONE NOT NULL,
    destroyed_by TEXT,
    destruction_certificate JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id TEXT NOT NULL,
    action TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    previous_hash TEXT,
    hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
