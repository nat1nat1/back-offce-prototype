--
-- PostgreSQL database dump
--

\restrict cIP3ftA4pkLJSNMLdHT4HMrqtNb29UBwQlebIhEzBnlQhVQQeVjxHKgEe4M0DbI

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: buyer_invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buyer_invoices (
    id integer NOT NULL,
    buyer_id integer,
    invoice_number text NOT NULL,
    po_number text,
    amount real NOT NULL,
    currency text DEFAULT 'EUR'::text,
    status text NOT NULL,
    invoice_date timestamp without time zone NOT NULL
);


ALTER TABLE public.buyer_invoices OWNER TO postgres;

--
-- Name: buyer_invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.buyer_invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.buyer_invoices_id_seq OWNER TO postgres;

--
-- Name: buyer_invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.buyer_invoices_id_seq OWNED BY public.buyer_invoices.id;


--
-- Name: buyers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buyers (
    id integer NOT NULL,
    buyer_id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    account_type text NOT NULL,
    company_name text,
    vat_number text,
    buyer_status text NOT NULL,
    registered_date timestamp without time zone,
    country text,
    is_blocked boolean DEFAULT false,
    risk_assessment text,
    storefront text,
    date_of_birth timestamp without time zone,
    chamber_of_commerce_number text,
    vat_verified_date timestamp without time zone,
    address_line_1 text,
    address_line_2 text,
    city text,
    postal_code text,
    outstanding_balance real DEFAULT 0,
    payment_orders_count integer DEFAULT 0,
    lots_awaiting_checkout integer DEFAULT 0,
    notes text
);


ALTER TABLE public.buyers OWNER TO postgres;

--
-- Name: buyers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.buyers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.buyers_id_seq OWNER TO postgres;

--
-- Name: buyers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.buyers_id_seq OWNED BY public.buyers.id;


--
-- Name: history_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.history_events (
    id integer NOT NULL,
    item_id integer NOT NULL,
    event_type text NOT NULL,
    event_title text NOT NULL,
    event_description text NOT NULL,
    event_date timestamp without time zone NOT NULL,
    user_id text,
    metadata text
);


ALTER TABLE public.history_events OWNER TO postgres;

--
-- Name: history_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.history_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.history_events_id_seq OWNER TO postgres;

--
-- Name: history_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.history_events_id_seq OWNED BY public.history_events.id;


--
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    id integer NOT NULL,
    display_id text NOT NULL,
    title text NOT NULL,
    auction_title text NOT NULL,
    date timestamp without time zone NOT NULL,
    status text NOT NULL,
    collection_status text NOT NULL,
    buyer_name text NOT NULL,
    buyer_email text NOT NULL,
    buyer_phone text NOT NULL,
    brand text NOT NULL,
    lot_display_id text NOT NULL,
    auction_display_id text NOT NULL,
    agreement_reference text NOT NULL,
    company_name text NOT NULL,
    company_id text NOT NULL,
    image_url text,
    lot_title text,
    item_description text,
    additional_information text,
    remarks text,
    category text,
    source_language text,
    translated boolean DEFAULT false,
    error_count integer DEFAULT 0,
    validation_failures text[] DEFAULT '{}'::text[],
    item_source text,
    platform text,
    primary_image_url text,
    image_gallery text[] DEFAULT '{}'::text[],
    documents text[] DEFAULT '{}'::text[],
    ownership_proof_url text,
    upload_name text,
    media_uploaded boolean DEFAULT false,
    tour_3d_url text,
    quantity integer DEFAULT 1,
    length real,
    width real,
    height real,
    weight real,
    material text,
    colour text,
    hs_code text,
    gtin text,
    location text,
    collection_window text,
    delivery_terms text,
    allocation text,
    day_partition text,
    special_handling_notes text,
    estimated_price real,
    currency text DEFAULT 'EUR'::text,
    vat_rate real,
    margin_good boolean DEFAULT false,
    additional_costs real,
    additional_costs_label text,
    seller_name text,
    seller_id text,
    billing_entity text,
    agreement_id text,
    agreement_name text,
    storefront text,
    site_manager text,
    auction_name text,
    lot_id_number text,
    closing_date timestamp without time zone,
    sale_attempt integer DEFAULT 1,
    publishing_status text,
    synced boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    updated_by text,
    lot_number text,
    external_reference text,
    product_name text,
    subcategory text,
    favourite_categories text[] DEFAULT '{}'::text[],
    model text,
    product_type text,
    seat_height real,
    depth real,
    collection_contact_info text,
    starting_price real,
    retail_price real,
    sale_type text,
    bid_deposit_required boolean DEFAULT false,
    listing_status text,
    buyer_id integer
);


ALTER TABLE public.items OWNER TO postgres;

--
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_id_seq OWNER TO postgres;

--
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;


--
-- Name: payment_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_orders (
    id integer NOT NULL,
    buyer_id integer,
    po_number text NOT NULL,
    invoice_number text,
    amount real NOT NULL,
    currency text DEFAULT 'EUR'::text,
    status text NOT NULL,
    order_date timestamp without time zone NOT NULL
);


ALTER TABLE public.payment_orders OWNER TO postgres;

--
-- Name: payment_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_orders_id_seq OWNER TO postgres;

--
-- Name: payment_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_orders_id_seq OWNED BY public.payment_orders.id;


--
-- Name: release_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.release_notes (
    id integer NOT NULL,
    date timestamp without time zone NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    tags text[]
);


ALTER TABLE public.release_notes OWNER TO postgres;

--
-- Name: release_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.release_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.release_notes_id_seq OWNER TO postgres;

--
-- Name: release_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.release_notes_id_seq OWNED BY public.release_notes.id;


--
-- Name: buyer_invoices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buyer_invoices ALTER COLUMN id SET DEFAULT nextval('public.buyer_invoices_id_seq'::regclass);


--
-- Name: buyers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buyers ALTER COLUMN id SET DEFAULT nextval('public.buyers_id_seq'::regclass);


--
-- Name: history_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.history_events ALTER COLUMN id SET DEFAULT nextval('public.history_events_id_seq'::regclass);


--
-- Name: items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);


--
-- Name: payment_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_orders ALTER COLUMN id SET DEFAULT nextval('public.payment_orders_id_seq'::regclass);


--
-- Name: release_notes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.release_notes ALTER COLUMN id SET DEFAULT nextval('public.release_notes_id_seq'::regclass);


--
-- Data for Name: buyer_invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.buyer_invoices (id, buyer_id, invoice_number, po_number, amount, currency, status, invoice_date) FROM stdin;
19	55	INV-2023-001	PO-998877	4500	EUR	Paid	2023-11-10 00:00:00
20	55	INV-2023-002	PO-998878	1250.5	EUR	Pending	2023-12-05 00:00:00
21	55	INV-2023-003	PO-998879	890	EUR	Paid	2023-12-20 00:00:00
\.


--
-- Data for Name: buyers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.buyers (id, buyer_id, name, email, phone, account_type, company_name, vat_number, buyer_status, registered_date, country, is_blocked, risk_assessment, storefront, date_of_birth, chamber_of_commerce_number, vat_verified_date, address_line_1, address_line_2, city, postal_code, outstanding_balance, payment_orders_count, lots_awaiting_checkout, notes) FROM stdin;
53	BUY-001	Thibaut Ickx	t.ickx@bedrijf.be	+32 478 55 12 34	Company	Bedrijf BVBA	\N	Buyer	\N	Belgium	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	0	0	\N
54	BUY-002	Emma Janssen	e.janssen@example.nl	+31 6 12345678	Private	\N	\N	Buyer	\N	Netherlands	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	0	0	\N
55	BUY-003	Marcus de Groot	m.degroot@zakelijk.nl	+31 6 98765432	Company	De Groot Trading BV	\N	Buyer	\N	Netherlands	f	Approved	TBAuctions Netherlands	1985-06-15 00:00:00	12345678	2023-01-10 00:00:00	Keizersgracht 123	\N	Amsterdam	1015 CJ	1250.5	3	1	High-value customer since 2020. Prefers pickup for logistics.
56	BUY-004	Precision Parts BV	inkoop@precisionparts.nl	+31 40 1234567	Company	Precision Parts BV	\N	Buyer	\N	Netherlands	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	0	0	\N
57	BUY-005	Galerie Amsterdam	acquisitions@galerie-adam.nl	+31 20 7654321	Company	Galerie Amsterdam BV	\N	Buyer	\N	Netherlands	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	0	0	\N
\.


--
-- Data for Name: history_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.history_events (id, item_id, event_type, event_title, event_description, event_date, user_id, metadata) FROM stdin;
161	102	status_changed	Status changed	Item's status has changed to READY_FOR_CHECKOUT	2026-01-04 20:46:00	admin@tbauctions.com	\N
162	102	lot_hammered	Lot hammered down	Lot 041-HZR has been hammered down automatically	2026-01-04 20:46:00	system	\N
163	102	checkout_created	Checkout created	Checkout status READY for lot A1-38994-9	2026-01-04 20:46:00	system	\N
164	102	bidding_closed	Lot bidding closed	Bidding finished for item 041-HZR on TWK platform with bid amount 960.00 EUR	2026-01-04 20:46:00	system	\N
165	102	item_copied	Item copied	New item 042-4KF	2026-01-02 09:05:00	admin@tbauctions.com	\N
166	102	status_changed	Status changed	Item's status has changed to RESERVED	2025-12-24 11:10:00	system	\N
167	102	item_published	Item published	Item 041-HZR published for platform TWK with saleId A1-38994 with start date Dec 29, 2025 15:00 and end date Jan 04, 2026 19:48	2025-12-24 11:10:00	admin@tbauctions.com	\N
168	102	item_updated	Item updated	Item has been updated.	2025-12-24 11:10:00	admin@tbauctions.com	\N
169	102	item_updated	Item updated	Item has been updated.	2025-12-24 11:07:00	admin@tbauctions.com	\N
170	102	item_updated	Item updated	Item has been updated.	2025-12-24 10:52:00	admin@tbauctions.com	\N
171	102	item_created	Item created	Item 042-8HG was created from template	2025-12-20 14:30:00	admin@tbauctions.com	\N
172	104	status_changed	Status changed	Item's status has changed to PAID	2025-12-22 10:15:00	system	\N
173	104	payment_received	Payment received	Payment of 825.00 EUR received via bank transfer	2025-12-22 10:14:00	system	\N
174	104	item_collected	Item collected	Item collected by buyer Marcus de Groot	2025-12-23 14:00:00	l.bakker@tbauctions.com	\N
175	105	status_changed	Status changed	Item's status has changed to RESERVED	2026-01-03 16:00:00	system	\N
176	105	bidding_closed	Lot bidding closed	Bidding finished for item 045-2MN on TWK platform with bid amount 47,500.00 EUR	2026-01-03 16:00:00	system	\N
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (id, display_id, title, auction_title, date, status, collection_status, buyer_name, buyer_email, buyer_phone, brand, lot_display_id, auction_display_id, agreement_reference, company_name, company_id, image_url, lot_title, item_description, additional_information, remarks, category, source_language, translated, error_count, validation_failures, item_source, platform, primary_image_url, image_gallery, documents, ownership_proof_url, upload_name, media_uploaded, tour_3d_url, quantity, length, width, height, weight, material, colour, hs_code, gtin, location, collection_window, delivery_terms, allocation, day_partition, special_handling_notes, estimated_price, currency, vat_rate, margin_good, additional_costs, additional_costs_label, seller_name, seller_id, billing_entity, agreement_id, agreement_name, storefront, site_manager, auction_name, lot_id_number, closing_date, sale_attempt, publishing_status, synced, created_at, updated_at, updated_by, lot_number, external_reference, product_name, subcategory, favourite_categories, model, product_type, seat_height, depth, collection_contact_info, starting_price, retail_price, sale_type, bid_deposit_required, listing_status, buyer_id) FROM stdin;
102	040-AK0	Henders en Hazel - Hoekbank Napels	Sofas and chaises longues Auction - January 2026	2026-01-15 00:00:00	Created	Not collected	Thibaut Ickx	t.ickx@bedrijf.be	+32 478 55 12 34	Henders en Hazel	040-AK0	AUC-2026-001	AGR-2026-001000	TBAuctions	TBA	\N	Henders en Hazel - Hoekbank Napels	High quality hoekbank napels from Henders en Hazel. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	Priority sale - seller relocating	Sofas and chaises longues	en	t	0	{}	Atlas	Atlas	https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400	{https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400}	{}	\N	\N	t	\N	1	50	40	30	10	Wood	Black	9401.61	\N	Amsterdam Warehouse	Mon-Fri 09:00-17:00	Buyer collection only	Section A-1	Morning	Heavy item - assistance required	500	EUR	21	t	50	Handling fee	JC Furniture	SEL-001	JC Furniture VOF	AGR-2026-1	Sofas and chaises longues Sale Agreement	Troostwijk Netherlands	Peter van Dijk	Sofas and chaises longues Auction - January 2026	040-AK0	2026-01-15 00:00:00	1	Draft	f	2026-01-22 22:46:33.788401	2026-01-22 22:46:33.788401	admin@tbauctions.com	100	REF-2025-100	Hoekbank	Corner Sofas	{}	Napels	Corner Sofas	\N	\N	Contact warehouse for appointment	100	1000	Reserve price	t	DRAFT	53
103	040-BN1	Henders en Hazel - Relaxfauteuil Vienna	Sofas and chaises longues Auction - January 2026	2026-01-13 00:00:00	Reserved	Pending	Emma Janssen	e.janssen@example.nl	+31 6 12345678	Henders en Hazel	040-BN1	AUC-2026-002	AGR-2026-001001	TBAuctions	TBA	\N	Henders en Hazel - Relaxfauteuil Vienna	High quality relaxfauteuil vienna from Henders en Hazel. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Sofas and chaises longues	nl	f	0	{}	Site Manager	TWK	https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400	{https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400}	{}	\N	\N	t	\N	1	53	42	32	15	Metal	White	8456.11	\N	Rotterdam Storage	Mon-Fri 09:00-17:00	Delivery available	Section B-2	Afternoon	\N	600	EUR	21	f	0	\N	Industrial Surplus BV	SEL-002	Industrial Surplus BV	AGR-2026-2	Sofas and chaises longues Sale Agreement	Troostwijk Industrial	Hans Mulder	Sofas and chaises longues Auction - January 2026	040-BN1	2026-01-13 00:00:00	1	Published	t	2026-01-22 22:46:33.796831	2026-01-22 22:46:33.796831	admin@tbauctions.com	101	REF-2025-101	Relaxfauteuil	Armchairs	{}	Vienna	Armchairs	\N	\N	Contact warehouse for appointment	150	1200	No reserve price	f	READY_FOR_CHECKOUT	54
104	040-CQ2	Richmond Interiors - Eettafel Kensington 180cm	Tables Auction - January 2026	2026-01-11 00:00:00	Paid	Collected	Marcus de Groot	m.degroot@zakelijk.nl	+31 6 98765432	Richmond Interiors	040-CQ2	AUC-2026-003	AGR-2026-001002	TBAuctions	TBA	\N	Richmond Interiors - Eettafel Kensington 180cm	High quality eettafel kensington 180cm from Richmond Interiors. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Tables	nl	f	0	{}	Atlas	TWK	https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400	{https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400}	{}	\N	\N	t	\N	1	56	44	34	20	Fabric	Brown	9403.40	\N	Eindhoven Industrial	Mon-Fri 09:00-17:00	Buyer collection only	Section C-3	Full day	\N	700	EUR	21	t	0	\N	Estate Sales NL	SEL-003	Estate Sales NL BV	AGR-2026-3	Tables Sale Agreement	Troostwijk Art & Antiques	Lisa Bakker	Tables Auction - January 2026	040-CQ2	2026-01-11 00:00:00	1	Completed	t	2026-01-22 22:46:33.803806	2026-01-22 22:46:33.803806	admin@tbauctions.com	102	REF-2025-102	Eettafel	Dining Tables	{}	Kensington 180cm	Dining Tables	\N	\N	Contact warehouse for appointment	200	1400	No reserve price	f	COMPLETED	55
105	040-DT3	Zuiver - Salontafel Marble	Tables Auction - January 2026	2026-01-09 00:00:00	Created	Not collected	Precision Parts BV	inkoop@precisionparts.nl	+31 40 1234567	Zuiver	040-DT3	AUC-2026-004	AGR-2026-001003	TBAuctions	TBA	\N	Zuiver - Salontafel Marble	High quality salontafel marble from Zuiver. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Tables	en	f	0	{}	Site Manager	Atlas	https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400	{https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400}	{}	\N	\N	t	\N	1	59	46	36	25	Leather	Grey	8471.30	\N	Utrecht Distribution	Mon-Fri 09:00-17:00	Delivery available	Section D-4	Morning	Heavy item - assistance required	800	EUR	21	f	50	Handling fee	Commercial Clearance	SEL-004	Commercial Clearance BV	AGR-2026-4	Tables Sale Agreement	Troostwijk Netherlands	Marie-Claire Dubois	Tables Auction - January 2026	040-DT3	2026-01-09 00:00:00	1	Draft	f	2026-01-22 22:46:33.809928	2026-01-22 22:46:33.809928	admin@tbauctions.com	103	REF-2025-103	Salontafel	Coffee Tables	{}	Marble	Coffee Tables	\N	\N	Contact warehouse for appointment	250	1600	No reserve price	f	DRAFT	56
106	040-EW4	Haas - ST-10 CNC Lathe	Industrial Machinery Auction - January 2026	2026-01-07 00:00:00	Reserved	Pending	Galerie Amsterdam	acquisitions@galerie-adam.nl	+31 20 7654321	Haas	040-EW4	AUC-2026-005	AGR-2026-001004	TBAuctions	TBA	\N	Haas - ST-10 CNC Lathe	High quality st-10 cnc lathe from Haas. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	Priority sale - seller relocating	Industrial Machinery	nl	f	0	{}	Atlas	TWK	https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400	{https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400}	{}	\N	\N	t	\N	1	62	48	38	30	Plastic	Blue	8528.72	\N	Den Haag Facility	Mon-Fri 09:00-17:00	Buyer collection only	Section E-5	Afternoon	\N	900	EUR	21	t	0	\N	Professional Equipment	SEL-005	Professional Equipment NL	AGR-2026-5	Industrial Machinery Sale Agreement	Troostwijk Industrial	Jan de Vries	Industrial Machinery Auction - January 2026	040-EW4	2026-01-07 00:00:00	1	Published	t	2026-01-22 22:46:33.815715	2026-01-22 22:46:33.815715	admin@tbauctions.com	104	REF-2025-104	ST-10	CNC Machines	{}	CNC Lathe	CNC Machines	\N	\N	Contact warehouse for appointment	300	1800	Reserve price	f	READY_FOR_CHECKOUT	57
107	040-FZ5	Lincoln Electric - IDEALARC DC-600	Industrial Machinery Auction - January 2026	2026-01-05 00:00:00	Paid	Collected	Thibaut Ickx	t.ickx@bedrijf.be	+32 478 55 12 34	Lincoln Electric	040-FZ5	AUC-2026-006	AGR-2026-001005	TBAuctions	TBA	\N	Lincoln Electric - IDEALARC DC-600	High quality idealarc dc-600 from Lincoln Electric. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Industrial Machinery	nl	t	0	{}	Site Manager	TWK	https://images.unsplash.com/photo-1504222490345-c075b6008014?w=400	{https://images.unsplash.com/photo-1504222490345-c075b6008014?w=400}	{}	\N	\N	t	\N	1	65	50	40	35	Wood	Black	9401.61	\N	Amsterdam Warehouse	Mon-Fri 09:00-17:00	Delivery available	Section F-6	Full day	\N	1000	EUR	21	f	0	\N	JC Furniture	SEL-001	JC Furniture VOF	AGR-2026-6	Industrial Machinery Sale Agreement	Troostwijk Art & Antiques	Peter van Dijk	Industrial Machinery Auction - January 2026	040-FZ5	2026-01-05 00:00:00	1	Completed	t	2026-01-22 22:46:33.821017	2026-01-22 22:46:33.821017	admin@tbauctions.com	105	REF-2025-105	IDEALARC	Welding Equipment	{}	DC-600	Welding Equipment	\N	\N	Contact warehouse for appointment	350	2000	No reserve price	t	COMPLETED	53
108	040-G]6	Antique - 19th Century Dutch Landscape	Fine Art Auction - January 2026	2026-01-03 00:00:00	Created	Not collected	Emma Janssen	e.janssen@example.nl	+31 6 12345678	Antique	040-G]6	AUC-2026-007	AGR-2026-001006	TBAuctions	TBA	\N	Antique - 19th Century Dutch Landscape	High quality 19th century dutch landscape from Antique. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Fine Art	en	f	0	{}	Atlas	Atlas	https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400	{https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400}	{}	\N	\N	t	\N	1	68	52	42	40	Metal	White	8456.11	\N	Rotterdam Storage	Mon-Fri 09:00-17:00	Buyer collection only	Section G-7	Morning	Heavy item - assistance required	1100	EUR	21	t	50	Handling fee	Industrial Surplus BV	SEL-002	Industrial Surplus BV	AGR-2026-7	Fine Art Sale Agreement	Troostwijk Netherlands	Hans Mulder	Fine Art Auction - January 2026	040-G]6	2026-01-03 00:00:00	1	Draft	f	2026-01-22 22:46:33.82435	2026-01-22 22:46:33.82435	admin@tbauctions.com	106	REF-2025-106	19th	Paintings	{}	Century Dutch Landscape	Paintings	\N	\N	Contact warehouse for appointment	400	2200	No reserve price	f	DRAFT	54
109	040-H`7	Contemporary - Abstract Steel Form	Fine Art Auction - January 2026	2026-01-01 00:00:00	Reserved	Pending	Marcus de Groot	m.degroot@zakelijk.nl	+31 6 98765432	Contemporary	040-H`7	AUC-2026-008	AGR-2026-001007	TBAuctions	TBA	\N	Contemporary - Abstract Steel Form	High quality abstract steel form from Contemporary. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Fine Art	nl	f	0	{}	Site Manager	TWK	https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=400	{https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=400}	{}	\N	\N	t	\N	1	71	54	44	45	Fabric	Brown	9403.40	\N	Eindhoven Industrial	Mon-Fri 09:00-17:00	Delivery available	Section H-8	Afternoon	\N	1200	EUR	21	f	0	\N	Estate Sales NL	SEL-003	Estate Sales NL BV	AGR-2026-8	Fine Art Sale Agreement	Troostwijk Industrial	Lisa Bakker	Fine Art Auction - January 2026	040-H`7	2026-01-01 00:00:00	1	Published	t	2026-01-22 22:46:33.829037	2026-01-22 22:46:33.829037	admin@tbauctions.com	107	REF-2025-107	Abstract	Sculptures	{}	Steel Form	Sculptures	\N	\N	Contact warehouse for appointment	450	2400	No reserve price	f	READY_FOR_CHECKOUT	55
110	040-Ic8	Denon - CD Player DCD-1600NE	Electronics Auction - January 2026	2025-12-30 00:00:00	Paid	Collected	Precision Parts BV	inkoop@precisionparts.nl	+31 40 1234567	Denon	040-Ic8	AUC-2026-009	AGR-2026-001008	TBAuctions	TBA	\N	Denon - CD Player DCD-1600NE	High quality cd player dcd-1600ne from Denon. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	Priority sale - seller relocating	Electronics	nl	f	0	{}	Atlas	TWK	https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400	{https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400}	{}	\N	\N	t	\N	1	74	56	46	50	Leather	Grey	8471.30	\N	Utrecht Distribution	Mon-Fri 09:00-17:00	Buyer collection only	Section I-9	Full day	\N	1300	EUR	21	t	0	\N	Commercial Clearance	SEL-004	Commercial Clearance BV	AGR-2026-9	Electronics Sale Agreement	Troostwijk Art & Antiques	Marie-Claire Dubois	Electronics Auction - January 2026	040-Ic8	2025-12-30 00:00:00	1	Completed	t	2026-01-22 22:46:33.833904	2026-01-22 22:46:33.833904	admin@tbauctions.com	108	REF-2025-108	CD	Audio Equipment	{}	Player DCD-1600NE	Audio Equipment	\N	\N	Contact warehouse for appointment	500	2600	Reserve price	f	COMPLETED	56
111	040-JL9	Samsung - 55" QLED 4K Display	Electronics Auction - January 2026	2025-12-28 00:00:00	Created	Not collected	Galerie Amsterdam	acquisitions@galerie-adam.nl	+31 20 7654321	Samsung	040-JL9	AUC-2026-010	AGR-2026-001009	TBAuctions	TBA	\N	Samsung - 55" QLED 4K Display	High quality 55" qled 4k display from Samsung. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Electronics	en	f	0	{}	Site Manager	Atlas	https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400	{https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400}	{}	\N	\N	t	\N	1	77	58	48	55	Plastic	Blue	8528.72	\N	Den Haag Facility	Mon-Fri 09:00-17:00	Delivery available	Section J-10	Morning	Heavy item - assistance required	1400	EUR	21	f	50	Handling fee	Professional Equipment	SEL-005	Professional Equipment NL	AGR-2026-10	Electronics Sale Agreement	Troostwijk Netherlands	Jan de Vries	Electronics Auction - January 2026	040-JL9	2025-12-28 00:00:00	1	Draft	f	2026-01-22 22:46:33.837148	2026-01-22 22:46:33.837148	admin@tbauctions.com	109	REF-2025-109	55"	Displays	{}	QLED 4K Display	Displays	\N	\N	Contact warehouse for appointment	550	2800	No reserve price	f	DRAFT	57
112	041-KO10	Steelcase - Executive Desk	Office Furniture Auction - January 2026	2025-12-26 00:00:00	Reserved	Pending	Thibaut Ickx	t.ickx@bedrijf.be	+32 478 55 12 34	Steelcase	041-KO10	AUC-2026-011	AGR-2026-001010	TBAuctions	TBA	\N	Steelcase - Executive Desk	High quality executive desk from Steelcase. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Office Furniture	nl	t	0	{}	Atlas	TWK	https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400	{https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400}	{}	\N	\N	t	\N	1	80	60	50	60	Wood	Black	9401.61	\N	Amsterdam Warehouse	Mon-Fri 09:00-17:00	Buyer collection only	Section A-11	Afternoon	\N	1500	EUR	21	t	0	\N	JC Furniture	SEL-001	JC Furniture VOF	AGR-2026-1	Office Furniture Sale Agreement	Troostwijk Industrial	Peter van Dijk	Office Furniture Auction - January 2026	041-KO10	2025-12-26 00:00:00	1	Published	t	2026-01-22 22:46:33.840711	2026-01-22 22:46:33.840711	admin@tbauctions.com	110	REF-2025-110	Executive	Desks	{}	Desk	Desks	\N	\N	Contact warehouse for appointment	600	3000	No reserve price	t	READY_FOR_CHECKOUT	53
113	041-LR11	Herman Miller - Sayl Chair	Office Furniture Auction - January 2026	2025-12-24 00:00:00	Paid	Collected	Emma Janssen	e.janssen@example.nl	+31 6 12345678	Herman Miller	041-LR11	AUC-2026-012	AGR-2026-001011	TBAuctions	TBA	\N	Herman Miller - Sayl Chair	High quality sayl chair from Herman Miller. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Office Furniture	nl	f	0	{}	Site Manager	TWK	https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400	{https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400}	{}	\N	\N	t	\N	1	83	62	52	65	Metal	White	8456.11	\N	Rotterdam Storage	Mon-Fri 09:00-17:00	Delivery available	Section B-12	Full day	\N	1600	EUR	21	f	0	\N	Industrial Surplus BV	SEL-002	Industrial Surplus BV	AGR-2026-2	Office Furniture Sale Agreement	Troostwijk Art & Antiques	Hans Mulder	Office Furniture Auction - January 2026	041-LR11	2025-12-24 00:00:00	1	Completed	t	2026-01-22 22:46:33.843799	2026-01-22 22:46:33.843799	admin@tbauctions.com	111	REF-2025-111	Sayl	Chairs	{}	Chair	Chairs	\N	\N	Contact warehouse for appointment	650	3200	No reserve price	f	COMPLETED	54
114	041-MU12	Toyota - Electric Forklift 8FBET18	Vehicles Auction - January 2026	2025-12-22 00:00:00	Created	Not collected	Marcus de Groot	m.degroot@zakelijk.nl	+31 6 98765432	Toyota	041-MU12	AUC-2026-013	AGR-2026-001012	TBAuctions	TBA	\N	Toyota - Electric Forklift 8FBET18	High quality electric forklift 8fbet18 from Toyota. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	Priority sale - seller relocating	Vehicles	en	f	0	{}	Atlas	Atlas	https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400	{https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400}	{}	\N	\N	t	\N	1	86	64	54	70	Fabric	Brown	9403.40	\N	Eindhoven Industrial	Mon-Fri 09:00-17:00	Buyer collection only	Section C-13	Morning	Heavy item - assistance required	1700	EUR	21	t	50	Handling fee	Estate Sales NL	SEL-003	Estate Sales NL BV	AGR-2026-3	Vehicles Sale Agreement	Troostwijk Netherlands	Lisa Bakker	Vehicles Auction - January 2026	041-MU12	2025-12-22 00:00:00	1	Draft	f	2026-01-22 22:46:33.848266	2026-01-22 22:46:33.848266	admin@tbauctions.com	112	REF-2025-112	Electric	Forklifts	{}	Forklift 8FBET18	Forklifts	\N	\N	Contact warehouse for appointment	700	3400	Reserve price	f	DRAFT	55
115	041-NX13	Mercedes-Benz - Vito 116 CDI	Vehicles Auction - January 2026	2025-12-20 00:00:00	Reserved	Pending	Precision Parts BV	inkoop@precisionparts.nl	+31 40 1234567	Mercedes-Benz	041-NX13	AUC-2026-014	AGR-2026-001013	TBAuctions	TBA	\N	Mercedes-Benz - Vito 116 CDI	High quality vito 116 cdi from Mercedes-Benz. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Vehicles	nl	f	0	{}	Site Manager	TWK	https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400	{https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400}	{}	\N	\N	t	\N	1	89	66	56	75	Leather	Grey	8471.30	\N	Utrecht Distribution	Mon-Fri 09:00-17:00	Delivery available	Section D-14	Afternoon	\N	1800	EUR	21	f	0	\N	Commercial Clearance	SEL-004	Commercial Clearance BV	AGR-2026-4	Vehicles Sale Agreement	Troostwijk Industrial	Marie-Claire Dubois	Vehicles Auction - January 2026	041-NX13	2025-12-20 00:00:00	1	Published	t	2026-01-22 22:46:33.852515	2026-01-22 22:46:33.852515	admin@tbauctions.com	113	REF-2025-113	Vito	Vans	{}	116 CDI	Vans	\N	\N	Contact warehouse for appointment	750	3600	No reserve price	f	READY_FOR_CHECKOUT	56
116	041-O[14	Rational - iVario Pro 2-S	Catering Equipment Auction - January 2026	2025-12-18 00:00:00	Paid	Collected	Galerie Amsterdam	acquisitions@galerie-adam.nl	+31 20 7654321	Rational	041-O[14	AUC-2026-015	AGR-2026-001014	TBAuctions	TBA	\N	Rational - iVario Pro 2-S	High quality ivario pro 2-s from Rational. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Catering Equipment	nl	f	0	{}	Atlas	TWK	https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400	{https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400}	{}	\N	\N	t	\N	1	92	68	58	80	Plastic	Blue	8528.72	\N	Den Haag Facility	Mon-Fri 09:00-17:00	Buyer collection only	Section E-15	Full day	\N	1900	EUR	21	t	0	\N	Professional Equipment	SEL-005	Professional Equipment NL	AGR-2026-5	Catering Equipment Sale Agreement	Troostwijk Art & Antiques	Jan de Vries	Catering Equipment Auction - January 2026	041-O[14	2025-12-18 00:00:00	1	Completed	t	2026-01-22 22:46:33.856593	2026-01-22 22:46:33.856593	admin@tbauctions.com	114	REF-2025-114	iVario	Ovens	{}	Pro 2-S	Ovens	\N	\N	Contact warehouse for appointment	800	3800	No reserve price	f	COMPLETED	57
117	041-P^15	Liebherr - GKPv 6573	Catering Equipment Auction - January 2026	2025-12-16 00:00:00	Created	Not collected	Thibaut Ickx	t.ickx@bedrijf.be	+32 478 55 12 34	Liebherr	041-P^15	AUC-2026-016	AGR-2026-001015	TBAuctions	TBA	\N	Liebherr - GKPv 6573	High quality gkpv 6573 from Liebherr. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Catering Equipment	en	t	0	{}	Site Manager	Atlas	https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400	{https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400}	{}	\N	\N	t	\N	1	95	70	60	85	Wood	Black	9401.61	\N	Amsterdam Warehouse	Mon-Fri 09:00-17:00	Delivery available	Section F-16	Morning	Heavy item - assistance required	2000	EUR	21	f	50	Handling fee	JC Furniture	SEL-001	JC Furniture VOF	AGR-2026-6	Catering Equipment Sale Agreement	Troostwijk Netherlands	Peter van Dijk	Catering Equipment Auction - January 2026	041-P^15	2025-12-16 00:00:00	1	Draft	f	2026-01-22 22:46:33.860579	2026-01-22 22:46:33.860579	admin@tbauctions.com	115	REF-2025-115	GKPv	Refrigeration	{}	6573	Refrigeration	\N	\N	Contact warehouse for appointment	850	4000	No reserve price	t	DRAFT	53
118	041-Qa16	Siemens - Somatom go.All CT	Medical Equipment Auction - January 2026	2025-12-14 00:00:00	Reserved	Pending	Emma Janssen	e.janssen@example.nl	+31 6 12345678	Siemens	041-Qa16	AUC-2026-017	AGR-2026-001016	TBAuctions	TBA	\N	Siemens - Somatom go.All CT	High quality somatom go.all ct from Siemens. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	Priority sale - seller relocating	Medical Equipment	nl	f	0	{}	Atlas	TWK	https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400	{https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400}	{}	\N	\N	t	\N	1	98	72	62	90	Metal	White	8456.11	\N	Rotterdam Storage	Mon-Fri 09:00-17:00	Buyer collection only	Section G-17	Afternoon	\N	2100	EUR	21	t	0	\N	Industrial Surplus BV	SEL-002	Industrial Surplus BV	AGR-2026-7	Medical Equipment Sale Agreement	Troostwijk Industrial	Hans Mulder	Medical Equipment Auction - January 2026	041-Qa16	2025-12-14 00:00:00	1	Published	t	2026-01-22 22:46:33.866233	2026-01-22 22:46:33.866233	admin@tbauctions.com	116	REF-2025-116	Somatom	Imaging	{}	go.All CT	Imaging	\N	\N	Contact warehouse for appointment	900	4200	Reserve price	f	READY_FOR_CHECKOUT	54
119	041-Rd17	Caterpillar - 336 Large Excavator	Construction Auction - January 2026	2025-12-12 00:00:00	Paid	Collected	Marcus de Groot	m.degroot@zakelijk.nl	+31 6 98765432	Caterpillar	041-Rd17	AUC-2026-018	AGR-2026-001017	TBAuctions	TBA	\N	Caterpillar - 336 Large Excavator	High quality 336 large excavator from Caterpillar. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Construction	nl	f	0	{}	Site Manager	TWK	https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400	{https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400}	{}	\N	\N	t	\N	1	101	74	64	95	Fabric	Brown	9403.40	\N	Eindhoven Industrial	Mon-Fri 09:00-17:00	Delivery available	Section H-18	Full day	\N	2200	EUR	21	f	0	\N	Estate Sales NL	SEL-003	Estate Sales NL BV	AGR-2026-8	Construction Sale Agreement	Troostwijk Art & Antiques	Lisa Bakker	Construction Auction - January 2026	041-Rd17	2025-12-12 00:00:00	1	Completed	t	2026-01-22 22:46:33.870384	2026-01-22 22:46:33.870384	admin@tbauctions.com	117	REF-2025-117	336	Excavators	{}	Large Excavator	Excavators	\N	\N	Contact warehouse for appointment	950	4400	No reserve price	f	COMPLETED	55
120	041-SM18	John Deere - Z994R Zero-Turn	Garden Auction - January 2026	2025-12-10 00:00:00	Created	Not collected	Precision Parts BV	inkoop@precisionparts.nl	+31 40 1234567	John Deere	041-SM18	AUC-2026-019	AGR-2026-001018	TBAuctions	TBA	\N	John Deere - Z994R Zero-Turn	High quality z994r zero-turn from John Deere. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Garden	en	f	0	{}	Atlas	Atlas	https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400	{https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400}	{}	\N	\N	t	\N	1	104	76	66	100	Leather	Grey	8471.30	\N	Utrecht Distribution	Mon-Fri 09:00-17:00	Buyer collection only	Section I-19	Morning	Heavy item - assistance required	2300	EUR	21	t	50	Handling fee	Commercial Clearance	SEL-004	Commercial Clearance BV	AGR-2026-9	Garden Sale Agreement	Troostwijk Netherlands	Marie-Claire Dubois	Garden Auction - January 2026	041-SM18	2025-12-10 00:00:00	1	Draft	f	2026-01-22 22:46:33.874644	2026-01-22 22:46:33.874644	admin@tbauctions.com	118	REF-2025-118	Z994R	Lawn Mowers	{}	Zero-Turn	Lawn Mowers	\N	\N	Contact warehouse for appointment	1000	4600	No reserve price	f	DRAFT	56
121	041-TP19	Martin - Rush MH 6 Wash	Lighting Auction - January 2026	2025-12-08 00:00:00	Reserved	Pending	Galerie Amsterdam	acquisitions@galerie-adam.nl	+31 20 7654321	Martin	041-TP19	AUC-2026-020	AGR-2026-001019	TBAuctions	TBA	\N	Martin - Rush MH 6 Wash	High quality rush mh 6 wash from Martin. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Lighting	nl	f	0	{}	Site Manager	TWK	https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=400	{https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=400}	{}	\N	\N	t	\N	1	107	78	68	105	Plastic	Blue	8528.72	\N	Den Haag Facility	Mon-Fri 09:00-17:00	Delivery available	Section J-20	Afternoon	\N	2400	EUR	21	f	0	\N	Professional Equipment	SEL-005	Professional Equipment NL	AGR-2026-10	Lighting Sale Agreement	Troostwijk Industrial	Jan de Vries	Lighting Auction - January 2026	041-TP19	2025-12-08 00:00:00	1	Published	t	2026-01-22 22:46:33.878877	2026-01-22 22:46:33.878877	admin@tbauctions.com	119	REF-2025-119	Rush	Stage Lighting	{}	MH 6 Wash	Stage Lighting	\N	\N	Contact warehouse for appointment	1050	4800	No reserve price	f	READY_FOR_CHECKOUT	57
122	042-US20	Henders en Hazel - Loungebank Oslo	Sofas and chaises longues Auction - January 2026	2025-12-06 00:00:00	Paid	Collected	Thibaut Ickx	t.ickx@bedrijf.be	+32 478 55 12 34	Henders en Hazel	042-US20	AUC-2026-021	AGR-2026-001020	TBAuctions	TBA	\N	Henders en Hazel - Loungebank Oslo	High quality loungebank oslo from Henders en Hazel. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	Priority sale - seller relocating	Sofas and chaises longues	nl	t	0	{}	Atlas	TWK	https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400	{https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400}	{}	\N	\N	t	\N	1	110	80	70	110	Wood	Black	9401.61	\N	Amsterdam Warehouse	Mon-Fri 09:00-17:00	Buyer collection only	Section A-1	Full day	\N	2500	EUR	21	t	0	\N	JC Furniture	SEL-001	JC Furniture VOF	AGR-2026-1	Sofas and chaises longues Sale Agreement	Troostwijk Art & Antiques	Peter van Dijk	Sofas and chaises longues Auction - January 2026	042-US20	2025-12-06 00:00:00	1	Completed	t	2026-01-22 22:46:33.882234	2026-01-22 22:46:33.882234	admin@tbauctions.com	120	REF-2025-120	Loungebank	Corner Sofas	{}	Oslo	Corner Sofas	\N	\N	Contact warehouse for appointment	1100	5000	Reserve price	t	COMPLETED	53
123	042-VV21	Henders en Hazel - Fauteuil Milano	Sofas and chaises longues Auction - January 2026	2025-12-04 00:00:00	Created	Not collected	Emma Janssen	e.janssen@example.nl	+31 6 12345678	Henders en Hazel	042-VV21	AUC-2026-022	AGR-2026-001021	TBAuctions	TBA	\N	Henders en Hazel - Fauteuil Milano	High quality fauteuil milano from Henders en Hazel. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Sofas and chaises longues	en	f	0	{}	Site Manager	Atlas	https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400	{https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400}	{}	\N	\N	t	\N	1	113	82	72	115	Metal	White	8456.11	\N	Rotterdam Storage	Mon-Fri 09:00-17:00	Delivery available	Section B-2	Morning	Heavy item - assistance required	2600	EUR	21	f	50	Handling fee	Industrial Surplus BV	SEL-002	Industrial Surplus BV	AGR-2026-2	Sofas and chaises longues Sale Agreement	Troostwijk Netherlands	Hans Mulder	Sofas and chaises longues Auction - January 2026	042-VV21	2025-12-04 00:00:00	1	Draft	f	2026-01-22 22:46:33.885871	2026-01-22 22:46:33.885871	admin@tbauctions.com	121	REF-2025-121	Fauteuil	Armchairs	{}	Milano	Armchairs	\N	\N	Contact warehouse for appointment	1150	5200	No reserve price	f	DRAFT	54
124	042-WY22	Richmond Interiors - Eettafel Blackbone 200cm	Tables Auction - January 2026	2025-12-02 00:00:00	Reserved	Pending	Marcus de Groot	m.degroot@zakelijk.nl	+31 6 98765432	Richmond Interiors	042-WY22	AUC-2026-023	AGR-2026-001022	TBAuctions	TBA	\N	Richmond Interiors - Eettafel Blackbone 200cm	High quality eettafel blackbone 200cm from Richmond Interiors. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Tables	nl	f	0	{}	Atlas	TWK	https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400	{https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400}	{}	\N	\N	t	\N	1	116	84	74	120	Fabric	Brown	9403.40	\N	Eindhoven Industrial	Mon-Fri 09:00-17:00	Buyer collection only	Section C-3	Afternoon	\N	2700	EUR	21	t	0	\N	Estate Sales NL	SEL-003	Estate Sales NL BV	AGR-2026-3	Tables Sale Agreement	Troostwijk Industrial	Lisa Bakker	Tables Auction - January 2026	042-WY22	2025-12-02 00:00:00	1	Published	t	2026-01-22 22:46:33.889438	2026-01-22 22:46:33.889438	admin@tbauctions.com	122	REF-2025-122	Eettafel	Dining Tables	{}	Blackbone 200cm	Dining Tables	\N	\N	Contact warehouse for appointment	1200	5400	No reserve price	f	READY_FOR_CHECKOUT	55
125	042-X\\23	Zuiver - Bijzettafel Round	Tables Auction - January 2026	2025-11-30 00:00:00	Paid	Collected	Precision Parts BV	inkoop@precisionparts.nl	+31 40 1234567	Zuiver	042-X\\23	AUC-2026-024	AGR-2026-001023	TBAuctions	TBA	\N	Zuiver - Bijzettafel Round	High quality bijzettafel round from Zuiver. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Tables	nl	f	0	{}	Site Manager	TWK	https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400	{https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400}	{}	\N	\N	t	\N	1	119	86	76	125	Leather	Grey	8471.30	\N	Utrecht Distribution	Mon-Fri 09:00-17:00	Delivery available	Section D-4	Full day	\N	2800	EUR	21	f	0	\N	Commercial Clearance	SEL-004	Commercial Clearance BV	AGR-2026-4	Tables Sale Agreement	Troostwijk Art & Antiques	Marie-Claire Dubois	Tables Auction - January 2026	042-X\\23	2025-11-30 00:00:00	1	Completed	t	2026-01-22 22:46:33.892762	2026-01-22 22:46:33.892762	admin@tbauctions.com	123	REF-2025-123	Bijzettafel	Coffee Tables	{}	Round	Coffee Tables	\N	\N	Contact warehouse for appointment	1250	5600	No reserve price	f	COMPLETED	56
126	042-Y_24	Haas - VF-2SS Machining Center	Industrial Machinery Auction - January 2026	2025-11-28 00:00:00	Created	Not collected	Galerie Amsterdam	acquisitions@galerie-adam.nl	+31 20 7654321	Haas	042-Y_24	AUC-2026-025	AGR-2026-001024	TBAuctions	TBA	\N	Haas - VF-2SS Machining Center	High quality vf-2ss machining center from Haas. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	Priority sale - seller relocating	Industrial Machinery	en	f	0	{}	Atlas	Atlas	https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400	{https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400}	{}	\N	\N	t	\N	1	122	88	78	130	Plastic	Blue	8528.72	\N	Den Haag Facility	Mon-Fri 09:00-17:00	Buyer collection only	Section E-5	Morning	Heavy item - assistance required	2900	EUR	21	t	50	Handling fee	Professional Equipment	SEL-005	Professional Equipment NL	AGR-2026-5	Industrial Machinery Sale Agreement	Troostwijk Netherlands	Jan de Vries	Industrial Machinery Auction - January 2026	042-Y_24	2025-11-28 00:00:00	1	Draft	f	2026-01-22 22:46:33.897057	2026-01-22 22:46:33.897057	admin@tbauctions.com	124	REF-2025-124	VF-2SS	CNC Machines	{}	Machining Center	CNC Machines	\N	\N	Contact warehouse for appointment	1300	5800	Reserve price	f	DRAFT	57
127	042-Zb25	Lincoln Electric - Precision TIG 375	Industrial Machinery Auction - January 2026	2025-11-26 00:00:00	Reserved	Pending	Thibaut Ickx	t.ickx@bedrijf.be	+32 478 55 12 34	Lincoln Electric	042-Zb25	AUC-2026-026	AGR-2026-001025	TBAuctions	TBA	\N	Lincoln Electric - Precision TIG 375	High quality precision tig 375 from Lincoln Electric. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Industrial Machinery	nl	t	0	{}	Site Manager	TWK	https://images.unsplash.com/photo-1504222490345-c075b6008014?w=400	{https://images.unsplash.com/photo-1504222490345-c075b6008014?w=400}	{}	\N	\N	t	\N	1	125	90	80	135	Wood	Black	9401.61	\N	Amsterdam Warehouse	Mon-Fri 09:00-17:00	Delivery available	Section F-6	Afternoon	\N	3000	EUR	21	f	0	\N	JC Furniture	SEL-001	JC Furniture VOF	AGR-2026-6	Industrial Machinery Sale Agreement	Troostwijk Industrial	Peter van Dijk	Industrial Machinery Auction - January 2026	042-Zb25	2025-11-26 00:00:00	1	Published	t	2026-01-22 22:46:33.899912	2026-01-22 22:46:33.899912	admin@tbauctions.com	125	REF-2025-125	Precision	Welding Equipment	{}	TIG 375	Welding Equipment	\N	\N	Contact warehouse for appointment	1350	6000	No reserve price	t	READY_FOR_CHECKOUT	53
128	042-AK26	Antique - Maritime Scene	Fine Art Auction - January 2026	2025-11-24 00:00:00	Paid	Collected	Emma Janssen	e.janssen@example.nl	+31 6 12345678	Antique	042-AK26	AUC-2026-027	AGR-2026-001026	TBAuctions	TBA	\N	Antique - Maritime Scene	High quality maritime scene from Antique. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Fine Art	nl	f	0	{}	Atlas	TWK	https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400	{https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400}	{}	\N	\N	t	\N	1	128	92	82	140	Metal	White	8456.11	\N	Rotterdam Storage	Mon-Fri 09:00-17:00	Buyer collection only	Section G-7	Full day	\N	3100	EUR	21	t	0	\N	Industrial Surplus BV	SEL-002	Industrial Surplus BV	AGR-2026-7	Fine Art Sale Agreement	Troostwijk Art & Antiques	Hans Mulder	Fine Art Auction - January 2026	042-AK26	2025-11-24 00:00:00	1	Completed	t	2026-01-22 22:46:33.903072	2026-01-22 22:46:33.903072	admin@tbauctions.com	126	REF-2025-126	Maritime	Paintings	{}	Scene	Paintings	\N	\N	Contact warehouse for appointment	1400	6200	No reserve price	f	COMPLETED	54
129	042-BN27	Contemporary - Bronze Horse	Fine Art Auction - January 2026	2025-11-22 00:00:00	Created	Not collected	Marcus de Groot	m.degroot@zakelijk.nl	+31 6 98765432	Contemporary	042-BN27	AUC-2026-028	AGR-2026-001027	TBAuctions	TBA	\N	Contemporary - Bronze Horse	High quality bronze horse from Contemporary. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Fine Art	en	f	0	{}	Site Manager	Atlas	https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=400	{https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=400}	{}	\N	\N	t	\N	1	131	94	84	145	Fabric	Brown	9403.40	\N	Eindhoven Industrial	Mon-Fri 09:00-17:00	Delivery available	Section H-8	Morning	Heavy item - assistance required	3200	EUR	21	f	50	Handling fee	Estate Sales NL	SEL-003	Estate Sales NL BV	AGR-2026-8	Fine Art Sale Agreement	Troostwijk Netherlands	Lisa Bakker	Fine Art Auction - January 2026	042-BN27	2025-11-22 00:00:00	1	Draft	f	2026-01-22 22:46:33.906452	2026-01-22 22:46:33.906452	admin@tbauctions.com	127	REF-2025-127	Bronze	Sculptures	{}	Horse	Sculptures	\N	\N	Contact warehouse for appointment	1450	6400	No reserve price	f	DRAFT	55
130	042-CQ28	Denon - Turntable DP-450USB	Electronics Auction - January 2026	2025-11-20 00:00:00	Reserved	Pending	Precision Parts BV	inkoop@precisionparts.nl	+31 40 1234567	Denon	042-CQ28	AUC-2026-029	AGR-2026-001028	TBAuctions	TBA	\N	Denon - Turntable DP-450USB	High quality turntable dp-450usb from Denon. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	Priority sale - seller relocating	Electronics	nl	f	0	{}	Atlas	TWK	https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400	{https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400}	{}	\N	\N	t	\N	1	134	96	86	150	Leather	Grey	8471.30	\N	Utrecht Distribution	Mon-Fri 09:00-17:00	Buyer collection only	Section I-9	Afternoon	\N	3300	EUR	21	t	0	\N	Commercial Clearance	SEL-004	Commercial Clearance BV	AGR-2026-9	Electronics Sale Agreement	Troostwijk Industrial	Marie-Claire Dubois	Electronics Auction - January 2026	042-CQ28	2025-11-20 00:00:00	1	Published	t	2026-01-22 22:46:33.910713	2026-01-22 22:46:33.910713	admin@tbauctions.com	128	REF-2025-128	Turntable	Audio Equipment	{}	DP-450USB	Audio Equipment	\N	\N	Contact warehouse for appointment	1500	6600	Reserve price	f	READY_FOR_CHECKOUT	56
131	042-DT29	Samsung - Video Wall Module	Electronics Auction - January 2026	2025-11-18 00:00:00	Paid	Collected	Galerie Amsterdam	acquisitions@galerie-adam.nl	+31 20 7654321	Samsung	042-DT29	AUC-2026-030	AGR-2026-001029	TBAuctions	TBA	\N	Samsung - Video Wall Module	High quality video wall module from Samsung. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Electronics	nl	f	0	{}	Site Manager	TWK	https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400	{https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400}	{}	\N	\N	t	\N	1	137	98	88	155	Plastic	Blue	8528.72	\N	Den Haag Facility	Mon-Fri 09:00-17:00	Delivery available	Section J-10	Full day	\N	3400	EUR	21	f	0	\N	Professional Equipment	SEL-005	Professional Equipment NL	AGR-2026-10	Electronics Sale Agreement	Troostwijk Art & Antiques	Jan de Vries	Electronics Auction - January 2026	042-DT29	2025-11-18 00:00:00	1	Completed	t	2026-01-22 22:46:33.913666	2026-01-22 22:46:33.913666	admin@tbauctions.com	129	REF-2025-129	Video	Displays	{}	Wall Module	Displays	\N	\N	Contact warehouse for appointment	1550	6800	No reserve price	f	COMPLETED	57
132	043-EW30	Steelcase - Sit-Stand Desk	Office Furniture Auction - January 2026	2025-11-16 00:00:00	Created	Not collected	Thibaut Ickx	t.ickx@bedrijf.be	+32 478 55 12 34	Steelcase	043-EW30	AUC-2026-031	AGR-2026-001030	TBAuctions	TBA	\N	Steelcase - Sit-Stand Desk	High quality sit-stand desk from Steelcase. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Office Furniture	en	t	0	{}	Atlas	Atlas	https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400	{https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400}	{}	\N	\N	t	\N	1	140	100	90	160	Wood	Black	9401.61	\N	Amsterdam Warehouse	Mon-Fri 09:00-17:00	Buyer collection only	Section A-11	Morning	Heavy item - assistance required	3500	EUR	21	t	50	Handling fee	JC Furniture	SEL-001	JC Furniture VOF	AGR-2026-1	Office Furniture Sale Agreement	Troostwijk Netherlands	Peter van Dijk	Office Furniture Auction - January 2026	043-EW30	2025-11-16 00:00:00	1	Draft	f	2026-01-22 22:46:33.916911	2026-01-22 22:46:33.916911	admin@tbauctions.com	130	REF-2025-130	Sit-Stand	Desks	{}	Desk	Desks	\N	\N	Contact warehouse for appointment	1600	7000	No reserve price	t	DRAFT	53
133	043-FZ31	Herman Miller - Embody Chair	Office Furniture Auction - January 2026	2025-11-14 00:00:00	Reserved	Pending	Emma Janssen	e.janssen@example.nl	+31 6 12345678	Herman Miller	043-FZ31	AUC-2026-032	AGR-2026-001031	TBAuctions	TBA	\N	Herman Miller - Embody Chair	High quality embody chair from Herman Miller. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Office Furniture	nl	f	0	{}	Site Manager	TWK	https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400	{https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400}	{}	\N	\N	t	\N	1	143	102	92	165	Metal	White	8456.11	\N	Rotterdam Storage	Mon-Fri 09:00-17:00	Delivery available	Section B-12	Afternoon	\N	3600	EUR	21	f	0	\N	Industrial Surplus BV	SEL-002	Industrial Surplus BV	AGR-2026-2	Office Furniture Sale Agreement	Troostwijk Industrial	Hans Mulder	Office Furniture Auction - January 2026	043-FZ31	2025-11-14 00:00:00	1	Published	t	2026-01-22 22:46:33.919684	2026-01-22 22:46:33.919684	admin@tbauctions.com	131	REF-2025-131	Embody	Chairs	{}	Chair	Chairs	\N	\N	Contact warehouse for appointment	1650	7200	No reserve price	f	READY_FOR_CHECKOUT	54
134	043-G]32	Toyota - Reach Truck 8BRU18	Vehicles Auction - January 2026	2025-11-12 00:00:00	Paid	Collected	Marcus de Groot	m.degroot@zakelijk.nl	+31 6 98765432	Toyota	043-G]32	AUC-2026-033	AGR-2026-001032	TBAuctions	TBA	\N	Toyota - Reach Truck 8BRU18	High quality reach truck 8bru18 from Toyota. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	Priority sale - seller relocating	Vehicles	nl	f	0	{}	Atlas	TWK	https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400	{https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400}	{}	\N	\N	t	\N	1	146	104	94	170	Fabric	Brown	9403.40	\N	Eindhoven Industrial	Mon-Fri 09:00-17:00	Buyer collection only	Section C-13	Full day	\N	3700	EUR	21	t	0	\N	Estate Sales NL	SEL-003	Estate Sales NL BV	AGR-2026-3	Vehicles Sale Agreement	Troostwijk Art & Antiques	Lisa Bakker	Vehicles Auction - January 2026	043-G]32	2025-11-12 00:00:00	1	Completed	t	2026-01-22 22:46:33.922932	2026-01-22 22:46:33.922932	admin@tbauctions.com	132	REF-2025-132	Reach	Forklifts	{}	Truck 8BRU18	Forklifts	\N	\N	Contact warehouse for appointment	1700	7400	Reserve price	f	COMPLETED	55
135	043-H`33	Mercedes-Benz - Sprinter 316 CDI	Vehicles Auction - January 2026	2025-11-10 00:00:00	Created	Not collected	Precision Parts BV	inkoop@precisionparts.nl	+31 40 1234567	Mercedes-Benz	043-H`33	AUC-2026-034	AGR-2026-001033	TBAuctions	TBA	\N	Mercedes-Benz - Sprinter 316 CDI	High quality sprinter 316 cdi from Mercedes-Benz. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Vehicles	en	f	0	{}	Site Manager	Atlas	https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400	{https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400}	{}	\N	\N	t	\N	1	149	106	96	175	Leather	Grey	8471.30	\N	Utrecht Distribution	Mon-Fri 09:00-17:00	Delivery available	Section D-14	Morning	Heavy item - assistance required	3800	EUR	21	f	50	Handling fee	Commercial Clearance	SEL-004	Commercial Clearance BV	AGR-2026-4	Vehicles Sale Agreement	Troostwijk Netherlands	Marie-Claire Dubois	Vehicles Auction - January 2026	043-H`33	2025-11-10 00:00:00	1	Draft	f	2026-01-22 22:46:33.925679	2026-01-22 22:46:33.925679	admin@tbauctions.com	133	REF-2025-133	Sprinter	Vans	{}	316 CDI	Vans	\N	\N	Contact warehouse for appointment	1750	7600	No reserve price	f	DRAFT	56
136	043-Ic34	Rational - iCombi Classic 6-1/1	Catering Equipment Auction - January 2026	2025-11-08 00:00:00	Reserved	Pending	Galerie Amsterdam	acquisitions@galerie-adam.nl	+31 20 7654321	Rational	043-Ic34	AUC-2026-035	AGR-2026-001034	TBAuctions	TBA	\N	Rational - iCombi Classic 6-1/1	High quality icombi classic 6-1/1 from Rational. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Catering Equipment	nl	f	0	{}	Atlas	TWK	https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400	{https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400}	{}	\N	\N	t	\N	1	152	108	98	180	Plastic	Blue	8528.72	\N	Den Haag Facility	Mon-Fri 09:00-17:00	Buyer collection only	Section E-15	Afternoon	\N	3900	EUR	21	t	0	\N	Professional Equipment	SEL-005	Professional Equipment NL	AGR-2026-5	Catering Equipment Sale Agreement	Troostwijk Industrial	Jan de Vries	Catering Equipment Auction - January 2026	043-Ic34	2025-11-08 00:00:00	1	Published	t	2026-01-22 22:46:33.928571	2026-01-22 22:46:33.928571	admin@tbauctions.com	134	REF-2025-134	iCombi	Ovens	{}	Classic 6-1/1	Ovens	\N	\N	Contact warehouse for appointment	1800	7800	No reserve price	f	READY_FOR_CHECKOUT	57
137	043-JL35	Liebherr - LCexv 4010	Catering Equipment Auction - January 2026	2025-11-06 00:00:00	Paid	Collected	Thibaut Ickx	t.ickx@bedrijf.be	+32 478 55 12 34	Liebherr	043-JL35	AUC-2026-036	AGR-2026-001035	TBAuctions	TBA	\N	Liebherr - LCexv 4010	High quality lcexv 4010 from Liebherr. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Catering Equipment	nl	t	0	{}	Site Manager	TWK	https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400	{https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400}	{}	\N	\N	t	\N	1	155	110	100	185	Wood	Black	9401.61	\N	Amsterdam Warehouse	Mon-Fri 09:00-17:00	Delivery available	Section F-16	Full day	\N	4000	EUR	21	f	0	\N	JC Furniture	SEL-001	JC Furniture VOF	AGR-2026-6	Catering Equipment Sale Agreement	Troostwijk Art & Antiques	Peter van Dijk	Catering Equipment Auction - January 2026	043-JL35	2025-11-06 00:00:00	1	Completed	t	2026-01-22 22:46:33.931425	2026-01-22 22:46:33.931425	admin@tbauctions.com	135	REF-2025-135	LCexv	Refrigeration	{}	4010	Refrigeration	\N	\N	Contact warehouse for appointment	1850	8000	No reserve price	t	COMPLETED	53
138	043-KO36	Siemens - Magnetom Aera 1.5T	Medical Equipment Auction - January 2026	2025-11-04 00:00:00	Created	Not collected	Emma Janssen	e.janssen@example.nl	+31 6 12345678	Siemens	043-KO36	AUC-2026-037	AGR-2026-001036	TBAuctions	TBA	\N	Siemens - Magnetom Aera 1.5T	High quality magnetom aera 1.5t from Siemens. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	Priority sale - seller relocating	Medical Equipment	en	f	0	{}	Atlas	Atlas	https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400	{https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400}	{}	\N	\N	t	\N	1	158	112	102	190	Metal	White	8456.11	\N	Rotterdam Storage	Mon-Fri 09:00-17:00	Buyer collection only	Section G-17	Morning	Heavy item - assistance required	4100	EUR	21	t	50	Handling fee	Industrial Surplus BV	SEL-002	Industrial Surplus BV	AGR-2026-7	Medical Equipment Sale Agreement	Troostwijk Netherlands	Hans Mulder	Medical Equipment Auction - January 2026	043-KO36	2025-11-04 00:00:00	1	Draft	f	2026-01-22 22:46:33.935132	2026-01-22 22:46:33.935132	admin@tbauctions.com	136	REF-2025-136	Magnetom	Imaging	{}	Aera 1.5T	Imaging	\N	\N	Contact warehouse for appointment	1900	8200	Reserve price	f	DRAFT	54
139	043-LR37	Caterpillar - 308 CR Mini Excavator	Construction Auction - January 2026	2025-11-02 00:00:00	Reserved	Pending	Marcus de Groot	m.degroot@zakelijk.nl	+31 6 98765432	Caterpillar	043-LR37	AUC-2026-038	AGR-2026-001037	TBAuctions	TBA	\N	Caterpillar - 308 CR Mini Excavator	High quality 308 cr mini excavator from Caterpillar. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Construction	nl	f	0	{}	Site Manager	TWK	https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400	{https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400}	{}	\N	\N	t	\N	1	161	114	104	195	Fabric	Brown	9403.40	\N	Eindhoven Industrial	Mon-Fri 09:00-17:00	Delivery available	Section H-18	Afternoon	\N	4200	EUR	21	f	0	\N	Estate Sales NL	SEL-003	Estate Sales NL BV	AGR-2026-8	Construction Sale Agreement	Troostwijk Industrial	Lisa Bakker	Construction Auction - January 2026	043-LR37	2025-11-02 00:00:00	1	Published	t	2026-01-22 22:46:33.937997	2026-01-22 22:46:33.937997	admin@tbauctions.com	137	REF-2025-137	308	Excavators	{}	CR Mini Excavator	Excavators	\N	\N	Contact warehouse for appointment	1950	8400	No reserve price	f	READY_FOR_CHECKOUT	55
140	043-MU38	John Deere - AutoTrac 3E	Garden Auction - January 2026	2025-10-31 00:00:00	Paid	Collected	Precision Parts BV	inkoop@precisionparts.nl	+31 40 1234567	John Deere	043-MU38	AUC-2026-039	AGR-2026-001038	TBAuctions	TBA	\N	John Deere - AutoTrac 3E	High quality autotrac 3e from John Deere. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Garden	nl	f	0	{}	Atlas	TWK	https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400	{https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400}	{}	\N	\N	t	\N	1	164	116	106	200	Leather	Grey	8471.30	\N	Utrecht Distribution	Mon-Fri 09:00-17:00	Buyer collection only	Section I-19	Full day	\N	4300	EUR	21	t	0	\N	Commercial Clearance	SEL-004	Commercial Clearance BV	AGR-2026-9	Garden Sale Agreement	Troostwijk Art & Antiques	Marie-Claire Dubois	Garden Auction - January 2026	043-MU38	2025-10-31 00:00:00	1	Completed	t	2026-01-22 22:46:33.941354	2026-01-22 22:46:33.941354	admin@tbauctions.com	138	REF-2025-138	AutoTrac	Lawn Mowers	{}	3E	Lawn Mowers	\N	\N	Contact warehouse for appointment	2000	8600	No reserve price	f	COMPLETED	56
141	043-NX39	Martin - MAC Encore Performance	Lighting Auction - January 2026	2025-10-29 00:00:00	Created	Not collected	Galerie Amsterdam	acquisitions@galerie-adam.nl	+31 20 7654321	Martin	043-NX39	AUC-2026-040	AGR-2026-001039	TBAuctions	TBA	\N	Martin - MAC Encore Performance	High quality mac encore performance from Martin. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Lighting	en	f	0	{}	Site Manager	Atlas	https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=400	{https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=400}	{}	\N	\N	t	\N	1	167	118	108	205	Plastic	Blue	8528.72	\N	Den Haag Facility	Mon-Fri 09:00-17:00	Delivery available	Section J-20	Morning	Heavy item - assistance required	4400	EUR	21	f	50	Handling fee	Professional Equipment	SEL-005	Professional Equipment NL	AGR-2026-10	Lighting Sale Agreement	Troostwijk Netherlands	Jan de Vries	Lighting Auction - January 2026	043-NX39	2025-10-29 00:00:00	1	Draft	f	2026-01-22 22:46:33.944727	2026-01-22 22:46:33.944727	admin@tbauctions.com	139	REF-2025-139	MAC	Stage Lighting	{}	Encore Performance	Stage Lighting	\N	\N	Contact warehouse for appointment	2050	8800	No reserve price	f	DRAFT	57
142	044-O[40	Henders en Hazel - Hoekbank Como	Sofas and chaises longues Auction - January 2026	2025-10-27 00:00:00	Reserved	Pending	Thibaut Ickx	t.ickx@bedrijf.be	+32 478 55 12 34	Henders en Hazel	044-O[40	AUC-2026-041	AGR-2026-001040	TBAuctions	TBA	\N	Henders en Hazel - Hoekbank Como	High quality hoekbank como from Henders en Hazel. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	Priority sale - seller relocating	Sofas and chaises longues	nl	t	0	{}	Atlas	TWK	https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400	{https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400}	{}	\N	\N	t	\N	1	170	120	110	210	Wood	Black	9401.61	\N	Amsterdam Warehouse	Mon-Fri 09:00-17:00	Buyer collection only	Section A-1	Afternoon	\N	4500	EUR	21	t	0	\N	JC Furniture	SEL-001	JC Furniture VOF	AGR-2026-1	Sofas and chaises longues Sale Agreement	Troostwijk Industrial	Peter van Dijk	Sofas and chaises longues Auction - January 2026	044-O[40	2025-10-27 00:00:00	1	Published	t	2026-01-22 22:46:33.948584	2026-01-22 22:46:33.948584	admin@tbauctions.com	140	REF-2025-140	Hoekbank	Corner Sofas	{}	Como	Corner Sofas	\N	\N	Contact warehouse for appointment	2100	9000	Reserve price	t	READY_FOR_CHECKOUT	53
143	044-P^41	Henders en Hazel - Clubfauteuil London	Sofas and chaises longues Auction - January 2026	2025-10-25 00:00:00	Paid	Collected	Emma Janssen	e.janssen@example.nl	+31 6 12345678	Henders en Hazel	044-P^41	AUC-2026-042	AGR-2026-001041	TBAuctions	TBA	\N	Henders en Hazel - Clubfauteuil London	High quality clubfauteuil london from Henders en Hazel. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Sofas and chaises longues	nl	f	0	{}	Site Manager	TWK	https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400	{https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400}	{}	\N	\N	t	\N	1	173	122	112	215	Metal	White	8456.11	\N	Rotterdam Storage	Mon-Fri 09:00-17:00	Delivery available	Section B-2	Full day	\N	4600	EUR	21	f	0	\N	Industrial Surplus BV	SEL-002	Industrial Surplus BV	AGR-2026-2	Sofas and chaises longues Sale Agreement	Troostwijk Art & Antiques	Hans Mulder	Sofas and chaises longues Auction - January 2026	044-P^41	2025-10-25 00:00:00	1	Completed	t	2026-01-22 22:46:33.952144	2026-01-22 22:46:33.952144	admin@tbauctions.com	141	REF-2025-141	Clubfauteuil	Armchairs	{}	London	Armchairs	\N	\N	Contact warehouse for appointment	2150	9200	No reserve price	f	COMPLETED	54
144	044-Qa42	Richmond Interiors - Eettafel Oakdale 220cm	Tables Auction - January 2026	2025-10-23 00:00:00	Created	Not collected	Marcus de Groot	m.degroot@zakelijk.nl	+31 6 98765432	Richmond Interiors	044-Qa42	AUC-2026-043	AGR-2026-001042	TBAuctions	TBA	\N	Richmond Interiors - Eettafel Oakdale 220cm	High quality eettafel oakdale 220cm from Richmond Interiors. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Tables	en	f	0	{}	Atlas	Atlas	https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400	{https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400}	{}	\N	\N	t	\N	1	176	124	114	220	Fabric	Brown	9403.40	\N	Eindhoven Industrial	Mon-Fri 09:00-17:00	Buyer collection only	Section C-3	Morning	Heavy item - assistance required	4700	EUR	21	t	50	Handling fee	Estate Sales NL	SEL-003	Estate Sales NL BV	AGR-2026-3	Tables Sale Agreement	Troostwijk Netherlands	Lisa Bakker	Tables Auction - January 2026	044-Qa42	2025-10-23 00:00:00	1	Draft	f	2026-01-22 22:46:33.955941	2026-01-22 22:46:33.955941	admin@tbauctions.com	142	REF-2025-142	Eettafel	Dining Tables	{}	Oakdale 220cm	Dining Tables	\N	\N	Contact warehouse for appointment	2200	9400	No reserve price	f	DRAFT	55
145	044-Rd43	Zuiver - Salontafel Oak	Tables Auction - January 2026	2025-10-21 00:00:00	Reserved	Pending	Precision Parts BV	inkoop@precisionparts.nl	+31 40 1234567	Zuiver	044-Rd43	AUC-2026-044	AGR-2026-001043	TBAuctions	TBA	\N	Zuiver - Salontafel Oak	High quality salontafel oak from Zuiver. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Tables	nl	f	0	{}	Site Manager	TWK	https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400	{https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400}	{}	\N	\N	t	\N	1	179	126	116	225	Leather	Grey	8471.30	\N	Utrecht Distribution	Mon-Fri 09:00-17:00	Delivery available	Section D-4	Afternoon	\N	4800	EUR	21	f	0	\N	Commercial Clearance	SEL-004	Commercial Clearance BV	AGR-2026-4	Tables Sale Agreement	Troostwijk Industrial	Marie-Claire Dubois	Tables Auction - January 2026	044-Rd43	2025-10-21 00:00:00	1	Published	t	2026-01-22 22:46:33.959211	2026-01-22 22:46:33.959211	admin@tbauctions.com	143	REF-2025-143	Salontafel	Coffee Tables	{}	Oak	Coffee Tables	\N	\N	Contact warehouse for appointment	2250	9600	No reserve price	f	READY_FOR_CHECKOUT	56
146	044-SM44	Haas - UMC-750 5-Axis Mill	Industrial Machinery Auction - January 2026	2025-10-19 00:00:00	Paid	Collected	Galerie Amsterdam	acquisitions@galerie-adam.nl	+31 20 7654321	Haas	044-SM44	AUC-2026-045	AGR-2026-001044	TBAuctions	TBA	\N	Haas - UMC-750 5-Axis Mill	High quality umc-750 5-axis mill from Haas. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	Priority sale - seller relocating	Industrial Machinery	nl	f	0	{}	Atlas	TWK	https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400	{https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400}	{}	\N	\N	t	\N	1	182	128	118	230	Plastic	Blue	8528.72	\N	Den Haag Facility	Mon-Fri 09:00-17:00	Buyer collection only	Section E-5	Full day	\N	4900	EUR	21	t	0	\N	Professional Equipment	SEL-005	Professional Equipment NL	AGR-2026-5	Industrial Machinery Sale Agreement	Troostwijk Art & Antiques	Jan de Vries	Industrial Machinery Auction - January 2026	044-SM44	2025-10-19 00:00:00	1	Completed	t	2026-01-22 22:46:33.962822	2026-01-22 22:46:33.962822	admin@tbauctions.com	144	REF-2025-144	UMC-750	CNC Machines	{}	5-Axis Mill	CNC Machines	\N	\N	Contact warehouse for appointment	2300	9800	Reserve price	f	COMPLETED	57
147	044-TP45	Lincoln Electric - Power Wave S500	Industrial Machinery Auction - January 2026	2025-10-17 00:00:00	Created	Not collected	Thibaut Ickx	t.ickx@bedrijf.be	+32 478 55 12 34	Lincoln Electric	044-TP45	AUC-2026-046	AGR-2026-001045	TBAuctions	TBA	\N	Lincoln Electric - Power Wave S500	High quality power wave s500 from Lincoln Electric. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Industrial Machinery	en	t	0	{}	Site Manager	Atlas	https://images.unsplash.com/photo-1504222490345-c075b6008014?w=400	{https://images.unsplash.com/photo-1504222490345-c075b6008014?w=400}	{}	\N	\N	t	\N	1	185	130	120	235	Wood	Black	9401.61	\N	Amsterdam Warehouse	Mon-Fri 09:00-17:00	Delivery available	Section F-6	Morning	Heavy item - assistance required	5000	EUR	21	f	50	Handling fee	JC Furniture	SEL-001	JC Furniture VOF	AGR-2026-6	Industrial Machinery Sale Agreement	Troostwijk Netherlands	Peter van Dijk	Industrial Machinery Auction - January 2026	044-TP45	2025-10-17 00:00:00	1	Draft	f	2026-01-22 22:46:33.966173	2026-01-22 22:46:33.966173	admin@tbauctions.com	145	REF-2025-145	Power	Welding Equipment	{}	Wave S500	Welding Equipment	\N	\N	Contact warehouse for appointment	2350	10000	No reserve price	t	DRAFT	53
148	044-US46	Antique - Portrait of a Lady	Fine Art Auction - January 2026	2025-10-15 00:00:00	Reserved	Pending	Emma Janssen	e.janssen@example.nl	+31 6 12345678	Antique	044-US46	AUC-2026-047	AGR-2026-001046	TBAuctions	TBA	\N	Antique - Portrait of a Lady	High quality portrait of a lady from Antique. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Fine Art	nl	f	0	{}	Atlas	TWK	https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400	{https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400}	{}	\N	\N	t	\N	1	188	132	122	240	Metal	White	8456.11	\N	Rotterdam Storage	Mon-Fri 09:00-17:00	Buyer collection only	Section G-7	Afternoon	\N	5100	EUR	21	t	0	\N	Industrial Surplus BV	SEL-002	Industrial Surplus BV	AGR-2026-7	Fine Art Sale Agreement	Troostwijk Industrial	Hans Mulder	Fine Art Auction - January 2026	044-US46	2025-10-15 00:00:00	1	Published	t	2026-01-22 22:46:33.969069	2026-01-22 22:46:33.969069	admin@tbauctions.com	146	REF-2025-146	Portrait	Paintings	{}	of a Lady	Paintings	\N	\N	Contact warehouse for appointment	2400	10200	No reserve price	f	READY_FOR_CHECKOUT	54
149	044-VV47	Contemporary - Marble Bust	Fine Art Auction - January 2026	2025-10-13 00:00:00	Paid	Collected	Marcus de Groot	m.degroot@zakelijk.nl	+31 6 98765432	Contemporary	044-VV47	AUC-2026-048	AGR-2026-001047	TBAuctions	TBA	\N	Contemporary - Marble Bust	High quality marble bust from Contemporary. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Fine Art	nl	f	0	{}	Site Manager	TWK	https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=400	{https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=400}	{}	\N	\N	t	\N	1	191	134	124	245	Fabric	Brown	9403.40	\N	Eindhoven Industrial	Mon-Fri 09:00-17:00	Delivery available	Section H-8	Full day	\N	5200	EUR	21	f	0	\N	Estate Sales NL	SEL-003	Estate Sales NL BV	AGR-2026-8	Fine Art Sale Agreement	Troostwijk Art & Antiques	Lisa Bakker	Fine Art Auction - January 2026	044-VV47	2025-10-13 00:00:00	1	Completed	t	2026-01-22 22:46:33.972319	2026-01-22 22:46:33.972319	admin@tbauctions.com	147	REF-2025-147	Marble	Sculptures	{}	Bust	Sculptures	\N	\N	Contact warehouse for appointment	2450	10400	No reserve price	f	COMPLETED	55
150	044-WY48	Denon - AV Receiver AVR-X4800H	Electronics Auction - January 2026	2025-10-11 00:00:00	Created	Not collected	Precision Parts BV	inkoop@precisionparts.nl	+31 40 1234567	Denon	044-WY48	AUC-2026-049	AGR-2026-001048	TBAuctions	TBA	\N	Denon - AV Receiver AVR-X4800H	High quality av receiver avr-x4800h from Denon. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	Priority sale - seller relocating	Electronics	en	f	0	{}	Atlas	Atlas	https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400	{https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400}	{}	\N	\N	t	\N	1	194	136	126	250	Leather	Grey	8471.30	\N	Utrecht Distribution	Mon-Fri 09:00-17:00	Buyer collection only	Section I-9	Morning	Heavy item - assistance required	5300	EUR	21	t	50	Handling fee	Commercial Clearance	SEL-004	Commercial Clearance BV	AGR-2026-9	Electronics Sale Agreement	Troostwijk Netherlands	Marie-Claire Dubois	Electronics Auction - January 2026	044-WY48	2025-10-11 00:00:00	1	Draft	f	2026-01-22 22:46:33.975893	2026-01-22 22:46:33.975893	admin@tbauctions.com	148	REF-2025-148	AV	Audio Equipment	{}	Receiver AVR-X4800H	Audio Equipment	\N	\N	Contact warehouse for appointment	2500	10600	Reserve price	f	DRAFT	56
151	044-X\\49	Samsung - 75" Commercial Display	Electronics Auction - January 2026	2025-10-09 00:00:00	Reserved	Pending	Galerie Amsterdam	acquisitions@galerie-adam.nl	+31 20 7654321	Samsung	044-X\\49	AUC-2026-050	AGR-2026-001049	TBAuctions	TBA	\N	Samsung - 75" Commercial Display	High quality 75" commercial display from Samsung. Excellent condition with full documentation.	Complete with all accessories and documentation. Professional maintenance history available.	\N	Electronics	nl	f	0	{}	Site Manager	TWK	https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400	{https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400}	{}	\N	\N	t	\N	1	197	138	128	255	Plastic	Blue	8528.72	\N	Den Haag Facility	Mon-Fri 09:00-17:00	Delivery available	Section J-10	Afternoon	\N	5400	EUR	21	f	0	\N	Professional Equipment	SEL-005	Professional Equipment NL	AGR-2026-10	Electronics Sale Agreement	Troostwijk Industrial	Jan de Vries	Electronics Auction - January 2026	044-X\\49	2025-10-09 00:00:00	1	Published	t	2026-01-22 22:46:33.979167	2026-01-22 22:46:33.979167	admin@tbauctions.com	149	REF-2025-149	75"	Displays	{}	Commercial Display	Displays	\N	\N	Contact warehouse for appointment	2550	10800	No reserve price	f	READY_FOR_CHECKOUT	57
\.


--
-- Data for Name: payment_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_orders (id, buyer_id, po_number, invoice_number, amount, currency, status, order_date) FROM stdin;
19	55	PO-998877	INV-2023-001	4500	EUR	Paid	2023-11-05 00:00:00
20	55	PO-998878	INV-2023-002	1250.5	EUR	Pending	2023-12-01 00:00:00
21	55	PO-998879	INV-2023-003	890	EUR	Paid	2023-12-15 00:00:00
\.


--
-- Data for Name: release_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.release_notes (id, date, title, content, tags) FROM stdin;
49	2025-12-19 00:00:00	Items Search: Returned to Inventory Status, Better Filters & Clearer Errors	We've added a Returned to inventory status to item cards, making it easy to see when an item has previously been up for sale and is now back in inventory\n\nAuto-suggest is now available for the Company name and Company ID filters, helping you quickly find and apply the right filter as you type\n\nThe item search error message has been improved to give clearer feedback when something goes wrong\n\nA new Lot display ID filter has been added, so you can directly search for a specific lot by its display ID\n\nWe've fixed an issue where the calendar filter was displayed incorrectly in Safari	{search,ui}
50	2025-12-12 00:00:00	Get an exact Buyer match	Get suggestions as you type into the Buyer Filter for name, email and phone number, so you can filter for exactly who you're looking for	{search}
51	2025-12-10 00:00:00	Items Search: Storefront Links & Lot Visibility Filter, scroll to top	Links to relevant storefronts have been added next to the lot display ID, so you can see what our customers see\n\nIf a lot is hidden from the storefront, we're now showing an icon next to the lot display ID to let you know\n\nSimilarly, we've also created a filter so you can isolate hidden lots if you need to find them\n\nTo help you return to the top of a long list quickly, we've added a 'scroll to top' button	{search,ui}
52	2025-12-05 00:00:00	Items search: Lot end date	A new filter for lot end date has been added\n\nLot end date is displayed on the item card when available	{search}
53	2025-12-03 00:00:00	Item card: Buyer blocked indicator	If a buyer is blocked, an icon is now shown next to the buyer's name.	{ui}
54	2025-11-28 00:00:00	Navigation improvements and faster movement between Atlas, Efficy, and key pages	Auction IDs now link to both Atlas & Efficy\n\nIntroduced 'sticky' pagination that stays visible while scrolling and remembers your last page-size preference\n\nItem IDs now link directly through to Atlas	{ui,search}
55	2025-11-20 00:00:00	Items search: Buyer phone number	Items can now be searched by buyer phone number\n\nBuyer phone number is displayed on the item card when available\n\nA new filter for buyer phone number has been added	{search}
56	2025-11-13 00:00:00	New filter for items search	Items can now be filtered by collection status\n\nFilter by collection status is now available in the filter modal\n\nCollection status is also visible in the item card when applicable	{search}
57	2025-11-11 00:00:00	Light and dark mode	We've added the ability to switch from light to dark mode. The Default is using your system settings.\n\nAdded theming	{ui}
58	2025-11-10 00:00:00	Pagination, more links and search improvements	You can now browse results across multiple pages, select more links in the item card and more easily manage your searches\n\nBuyer name and email now link directly to the Atlas Buyer details page\n\nInvoice numbers now link to the Atlas Invoice filtered results page\n\nSelect how many results to display per page\n\nNavigate quickly between pages to find exactly what you need\n\nSearch bar now is clearable with an X button\n\nSearch filter by brand is now available	{search}
59	2025-11-05 00:00:00	Improved functionality in item search results	Company links now point to the company overview page in ATLAS\n\nGeneral UI improvements in item search results\n\nCopy button on hover for information fields in the item search results\n\nSearch results are not shown for empty queries without filters and a message is displayed instead	{search}
60	2025-11-03 00:00:00	Buyer email search and new navigation	We've added the ability to search for buyer emails.\n\nSearch buyer emails\n\nRefined left navigation	{buyers,ui}
61	2025-10-28 00:00:00	New filters in Items Search	We have added new filters to the Items Search feature to help you refine your search results more effectively.\n\nFilter by Buyer Name\n\nFilter by Buyer Email\n\nFilter by Company Name\n\nFilter by Company ID\n\nFilter by Agreement Reference	{search}
62	2025-10-24 00:00:00	New searchable field: Item title	We've added the ability to search for Item Titles in their source language. Enjoy!	{search}
63	2025-10-15 00:00:00	Welcome to Atlas Back Office Search	This is the very first version of Atlas Back Office Search: a new tool designed to help you find what you need more easily on Atlas. We're starting simple and building iteratively, with regular updates and new features to come.\n\nIn this first version, you can:\n\nQuickly find Items using search\n\nView key information directly in item cards\n\nClick through to start workflows in Atlas\n\nThanks for trying it out - and stay tuned for improvements coming soon.	{search,ui}
\.


--
-- Name: buyer_invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.buyer_invoices_id_seq', 21, true);


--
-- Name: buyers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.buyers_id_seq', 57, true);


--
-- Name: history_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.history_events_id_seq', 176, true);


--
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_id_seq', 151, true);


--
-- Name: payment_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_orders_id_seq', 21, true);


--
-- Name: release_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.release_notes_id_seq', 63, true);


--
-- Name: buyer_invoices buyer_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buyer_invoices
    ADD CONSTRAINT buyer_invoices_pkey PRIMARY KEY (id);


--
-- Name: buyers buyers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buyers
    ADD CONSTRAINT buyers_pkey PRIMARY KEY (id);


--
-- Name: history_events history_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.history_events
    ADD CONSTRAINT history_events_pkey PRIMARY KEY (id);


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: payment_orders payment_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_orders
    ADD CONSTRAINT payment_orders_pkey PRIMARY KEY (id);


--
-- Name: release_notes release_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.release_notes
    ADD CONSTRAINT release_notes_pkey PRIMARY KEY (id);


--
-- Name: buyer_invoices buyer_invoices_buyer_id_buyers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buyer_invoices
    ADD CONSTRAINT buyer_invoices_buyer_id_buyers_id_fk FOREIGN KEY (buyer_id) REFERENCES public.buyers(id);


--
-- Name: items items_buyer_id_buyers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_buyer_id_buyers_id_fk FOREIGN KEY (buyer_id) REFERENCES public.buyers(id);


--
-- Name: payment_orders payment_orders_buyer_id_buyers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_orders
    ADD CONSTRAINT payment_orders_buyer_id_buyers_id_fk FOREIGN KEY (buyer_id) REFERENCES public.buyers(id);


--
-- PostgreSQL database dump complete
--

\unrestrict cIP3ftA4pkLJSNMLdHT4HMrqtNb29UBwQlebIhEzBnlQhVQQeVjxHKgEe4M0DbI

