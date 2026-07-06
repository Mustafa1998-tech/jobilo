import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { Pool } from 'pg';

async function main() {
  console.log('URL:', process.env.DATABASE_URL?.substring(0, 30) + '...');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  console.log('Seeding database...');

  // Clean existing data
  const tables = [
    'deliverables', 'milestones', 'reviews',
    'dispute_messages', 'dispute_participants', 'disputes', 'message_attachments',
    'messages', 'notifications', 'proposal_attachments', 'proposals',
    'project_bookmarks', 'project_attachments', 'project_skills', 'projects',
    'freelancer_skills', 'portfolios', 'freelancer_profiles', 'client_profiles',
    'social_links', 'user_sessions', 'audit_logs',
    'email_verifications', 'user_badges', 'badges', 'saved_searches', 'skills',
    'categories', 'platform_settings', 'subscriptions', 'subscription_plans', 'users',
  ];
  for (const table of tables) {
    await client.query(`DELETE FROM "${table}"`);
  }

  const passwordHash = await bcrypt.hash('Password123!', 12);

  // Categories
  const categories: any[] = [];
  const catData = [
    { name: 'Web Development', nameAr: 'تطوير مواقع', slug: 'web-development', icon: '🌐', color: '#3B82F6', sortOrder: 1 },
    { name: 'Mobile Development', nameAr: 'تطوير تطبيقات', slug: 'mobile-development', icon: '📱', color: '#8B5CF6', sortOrder: 2 },
    { name: 'Graphic Design', nameAr: 'تصميم جرافيك', slug: 'graphic-design', icon: '🎨', color: '#EC4899', sortOrder: 3 },
    { name: 'Writing & Translation', nameAr: 'كتابة وترجمة', slug: 'writing-translation', icon: '✍️', color: '#10B981', sortOrder: 4 },
    { name: 'Marketing & SEO', nameAr: 'تسويق وسيو', slug: 'marketing-seo', icon: '📈', color: '#F59E0B', sortOrder: 5 },
    { name: 'Data Science & AI', nameAr: 'علوم بيانات وذكاء اصطناعي', slug: 'data-science-ai', icon: '🤖', color: '#EF4444', sortOrder: 6 },
    { name: 'Video & Animation', nameAr: 'فيديو وأنيميشن', slug: 'video-animation', icon: '🎬', color: '#F97316', sortOrder: 7 },
    { name: 'Business & Consulting', nameAr: 'أعمال واستشارات', slug: 'business-consulting', icon: '💼', color: '#14B8A6', sortOrder: 8 },
  ];
  for (const c of catData) {
    const id = uuid();
    await client.query(
      `INSERT INTO categories (id, name, name_ar, slug, icon, color, sort_order, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())`,
      [id, c.name, c.nameAr, c.slug, c.icon, c.color, c.sortOrder]
    );
    categories.push({ ...c, id });
  }

  // Skills
  const allSkills: any[] = [];
  const skillData: { name: string; nameAr: string; catIndex: number }[] = [
    { name: 'React', nameAr: 'رياكت', catIndex: 0 },
    { name: 'Next.js', nameAr: 'نكست', catIndex: 0 },
    { name: 'Node.js', nameAr: 'نود', catIndex: 0 },
    { name: 'TypeScript', nameAr: 'تايب سكريبت', catIndex: 0 },
    { name: 'HTML/CSS', nameAr: 'إتش تي إم إل/سي إس إس', catIndex: 0 },
    { name: 'Vue.js', nameAr: 'فيو', catIndex: 0 },
    { name: 'Python', nameAr: 'بايثون', catIndex: 0 },
    { name: 'PHP', nameAr: 'بي إتش بي', catIndex: 0 },
    { name: 'Laravel', nameAr: 'لارافيل', catIndex: 0 },
    { name: 'Flutter', nameAr: 'فلتر', catIndex: 1 },
    { name: 'React Native', nameAr: 'رياكت نيتف', catIndex: 1 },
    { name: 'Swift', nameAr: 'سويفت', catIndex: 1 },
    { name: 'Kotlin', nameAr: 'كوتلن', catIndex: 1 },
    { name: 'Adobe Photoshop', nameAr: 'أدوبي فوتوشوب', catIndex: 2 },
    { name: 'Adobe Illustrator', nameAr: 'أدوبي إليستريتور', catIndex: 2 },
    { name: 'Figma', nameAr: 'فيجما', catIndex: 2 },
    { name: 'UI/UX Design', nameAr: 'تصميم واجهات وتجربة مستخدم', catIndex: 2 },
    { name: 'Logo Design', nameAr: 'تصميم شعارات', catIndex: 2 },
    { name: 'Arabic Content Writing', nameAr: 'كتابة محتوى عربي', catIndex: 3 },
    { name: 'English Content Writing', nameAr: 'كتابة محتوى إنجليزي', catIndex: 3 },
    { name: 'Arabic-English Translation', nameAr: 'ترجمة عربي إنجليزي', catIndex: 3 },
    { name: 'Copywriting', nameAr: 'كتابة إعلانات', catIndex: 3 },
    { name: 'Proofreading', nameAr: 'تدقيق لغوي', catIndex: 3 },
    { name: 'SEO', nameAr: 'سيو', catIndex: 4 },
    { name: 'Social Media Marketing', nameAr: 'تسويق تواصل اجتماعي', catIndex: 4 },
    { name: 'Google Ads', nameAr: 'إعلانات جوجل', catIndex: 4 },
    { name: 'Content Marketing', nameAr: 'تسويق محتوى', catIndex: 4 },
    { name: 'Email Marketing', nameAr: 'تسويق بريد إلكتروني', catIndex: 4 },
    { name: 'Machine Learning', nameAr: 'تعلم آلي', catIndex: 5 },
    { name: 'Data Analysis', nameAr: 'تحليل بيانات', catIndex: 5 },
    { name: 'Deep Learning', nameAr: 'تعلم عميق', catIndex: 5 },
    { name: 'NLP', nameAr: 'معالجة لغة طبيعية', catIndex: 5 },
    { name: 'Video Editing', nameAr: 'مونتاج فيديو', catIndex: 6 },
    { name: 'Motion Graphics', nameAr: 'رسوم متحركة', catIndex: 6 },
    { name: '3D Modeling', nameAr: 'نمذجة ثلاثية الأبعاد', catIndex: 6 },
    { name: 'Business Planning', nameAr: 'تخطيط أعمال', catIndex: 7 },
    { name: 'Financial Consulting', nameAr: 'استشارات مالية', catIndex: 7 },
    { name: 'Project Management', nameAr: 'إدارة مشاريع', catIndex: 7 },
  ];
  for (const s of skillData) {
    const id = uuid();
    await client.query(
      `INSERT INTO skills (id, name, name_ar, category_id, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, true, NOW(), NOW())`,
      [id, s.name, s.nameAr, categories[s.catIndex].id]
    );
    allSkills.push({ ...s, id });
  }

  // Users
  const adminId = uuid();
  const freelancer1Id = uuid();
  const freelancer2Id = uuid();
  const client1Id = uuid();
  const client2Id = uuid();

  // Admin
  await client.query(
    `INSERT INTO users (id, email, password_hash, role, status, email_verified_at, created_at, updated_at) VALUES ($1, $2, $3, 'SUPER_ADMIN', 'ACTIVE', NOW(), NOW(), NOW())`,
    [adminId, 'admin@jobilo.com', passwordHash]
  );

  // Freelancer 1: Ahmed
  await client.query(
    `INSERT INTO users (id, email, password_hash, role, status, email_verified_at, is_profile_complete, created_at, updated_at) VALUES ($1, $2, $3, 'FREELANCER', 'ACTIVE', NOW(), true, NOW(), NOW())`,
    [freelancer1Id, 'ahmed@example.com', passwordHash]
  );
  const fp1Id = uuid();
  await client.query(
    `INSERT INTO freelancer_profiles (id, user_id, first_name, last_name, title, bio, hourly_rate, experience_level, years_experience, languages, education, average_rating, completed_projects, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, 'ADVANCED', $8, $9, $10, $11, $12, NOW(), NOW())`,
    [fp1Id, freelancer1Id, 'Ahmed', 'Ali', 'مطور Full Stack متخصص في Next.js و Node.js', 'مطور ويب بخبرة 5 سنوات في بناء تطبيقات الويب الحديثة باستخدام React وNode.js. عملت مع أكثر من 30 عميل في مشاريع متنوعة.', 25.00, 5, JSON.stringify([{ name: 'العربية', level: 'native' }, { name: 'English', level: 'advanced' }]), JSON.stringify([{ degree: 'بكالوريوس علوم حاسوب', university: 'جامعة الخرطوم', year: 2019 }]), 4.8, 32]
  );
  // Freelancer 2: Nada
  await client.query(
    `INSERT INTO users (id, email, password_hash, role, status, email_verified_at, is_profile_complete, created_at, updated_at) VALUES ($1, $2, $3, 'FREELANCER', 'ACTIVE', NOW(), true, NOW(), NOW())`,
    [freelancer2Id, 'nada@example.com', passwordHash]
  );
  const fp2Id = uuid();
  await client.query(
    `INSERT INTO freelancer_profiles (id, user_id, first_name, last_name, title, bio, hourly_rate, experience_level, years_experience, languages, average_rating, completed_projects, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, 'INTERMEDIATE', $8, $9, $10, $11, NOW(), NOW())`,
    [fp2Id, freelancer2Id, 'Nada', 'Omar', 'مصممة UI/UX ومطورة واجهات Frontend', 'مصممة واجهات مستخدم بخبرة 3 سنوات في تصميم وتطوير تطبيقات ويب جميلة وسهلة الاستخدام.', 20.00, 3, JSON.stringify([{ name: 'العربية', level: 'native' }, { name: 'English', level: 'intermediate' }]), 4.5, 18]
  );

  // Client 1: Sara
  await client.query(
    `INSERT INTO users (id, email, password_hash, role, status, email_verified_at, is_profile_complete, created_at, updated_at) VALUES ($1, $2, $3, 'CLIENT', 'ACTIVE', NOW(), true, NOW(), NOW())`,
    [client1Id, 'sara@example.com', passwordHash]
  );
  await client.query(
    `INSERT INTO client_profiles (id, user_id, company_name, industry, description, total_projects_posted, average_rating, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
    [uuid(), client1Id, 'شركة نور التقنية', 'تقنية معلومات', 'شركة تقنية سودانية تقدم حلول رقمية متكاملة', 8, 4.6]
  );

  // Client 2: Khaled
  await client.query(
    `INSERT INTO users (id, email, password_hash, role, status, email_verified_at, is_profile_complete, created_at, updated_at) VALUES ($1, $2, $3, 'CLIENT', 'ACTIVE', NOW(), true, NOW(), NOW())`,
    [client2Id, 'khaled@example.com', passwordHash]
  );
  await client.query(
    `INSERT INTO client_profiles (id, user_id, company_name, company_website, industry, description, total_projects_posted, average_rating, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
    [uuid(), client2Id, 'مؤسسة الخالد للتسويق', 'https://khalidmarketing.sd', 'تسويق', 'وكالة تسويق رقمي متخصصة في السوق السوداني', 15, 4.3]
  );

  // Freelancer Skills
  const fs1Skills = allSkills.filter(s => ['React', 'Next.js', 'Node.js', 'TypeScript', 'Python'].includes(s.name));
  for (const skill of fs1Skills) {
    await client.query(
      `INSERT INTO freelancer_skills (id, freelancer_profile_id, skill_id, level, created_at) VALUES ($1, $2, $3, 'ADVANCED', NOW())`,
      [uuid(), fp1Id, skill.id]
    );
  }
  const fs2Skills = allSkills.filter(s => ['Figma', 'UI/UX Design', 'HTML/CSS', 'React'].includes(s.name));
  for (const skill of fs2Skills) {
    await client.query(
      `INSERT INTO freelancer_skills (id, freelancer_profile_id, skill_id, level, created_at) VALUES ($1, $2, $3, 'INTERMEDIATE', NOW())`,
      [uuid(), fp2Id, skill.id]
    );
  }

  // Projects
  const project1Id = uuid();
  const project2Id = uuid();
  const project3Id = uuid();
  const project4Id = uuid();
  const project5Id = uuid();

  const projectData = [
    { id: project1Id, title: 'تطوير منصة إلكترونية للتجارة', slug: 'ecommerce-platform', categoryIndex: 0, clientId: client1Id, description: 'نبحث عن مطور Full Stack لبناء منصة تجارة إلكترونية متكاملة مع لوحة تحكم وإدارة مخزون وبوابة دفع.', budgetMin: 3000, budgetMax: 5000, days: 45, expLevel: 'ADVANCED', urgent: true, skills: ['React', 'Next.js', 'Node.js', 'TypeScript'] },
    { id: project2Id, title: 'تصميم واجهة تطبيق جوال', slug: 'mobile-app-ui-design', categoryIndex: 2, clientId: client2Id, description: 'مطلوب مصمم UI/UX لتصميم واجهات تطبيق جوال للتوصيل (iOS + Android).', budgetMin: 800, budgetMax: 1500, days: 20, expLevel: 'INTERMEDIATE', urgent: false, skills: ['Figma', 'UI/UX Design'] },
    { id: project3Id, title: 'ترجمة موقع إلكتروني من الإنجليزية للعربية', slug: 'website-translation-ar-en', categoryIndex: 3, clientId: client1Id, description: 'ترجمة موقع إلكتروني تجاري من الإنجليزية إلى العربية الفصحى. الموقع يحتوي على 50 صفحة.', budgetMin: 500, budgetMax: 800, days: 14, expLevel: 'INTERMEDIATE', urgent: false, skills: ['Arabic-English Translation', 'Proofreading', 'Arabic Content Writing'] },
    { id: project4Id, title: 'حملة إعلانات جوجل للمتجر الإلكتروني', slug: 'google-ads-campaign', categoryIndex: 4, clientId: client1Id, description: 'نحتاج خبير في Google Ads لإدارة حملة إعلانات لمتجرنا الإلكتروني الجديد. الميزانية الشهرية $2000.', budgetMin: 1000, budgetMax: 2000, days: 30, expLevel: 'ADVANCED', urgent: true, skills: ['Google Ads', 'SEO', 'Social Media Marketing'] },
    { id: project5Id, title: 'تحليل بيانات مبيعات الربع الأول', slug: 'sales-data-analysis', categoryIndex: 5, clientId: client2Id, description: 'مطلوب محلل بيانات لتحليل بيانات مبيعات الربع الأول وعرضها في تقارير ورسوم بيانية.', budgetMin: 400, budgetMax: 700, days: 10, expLevel: 'INTERMEDIATE', urgent: false, skills: ['Data Analysis', 'Python', 'Machine Learning'] },
  ];

  for (const p of projectData) {
    await client.query(
      `INSERT INTO projects (id, client_id, category_id, title, slug, description, budget_min, budget_max, duration_days, experience_level, status, is_urgent, published_at, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'OPEN', $11, NOW(), NOW(), NOW())`,
      [p.id, p.clientId, categories[p.categoryIndex].id, p.title, p.slug, p.description, p.budgetMin, p.budgetMax, p.days, p.expLevel, p.urgent]
    );

    for (const skillName of p.skills) {
      const skill = allSkills.find(s => s.name === skillName);
      if (skill) {
        await client.query(
          `INSERT INTO project_skills (id, project_id, skill_id, level) VALUES ($1, $2, $3, 'INTERMEDIATE')`,
          [uuid(), p.id, skill.id]
        );
      }
    }
  }

  // Proposals
  await client.query(
    `INSERT INTO proposals (id, project_id, freelancer_id, cover_letter, bid_amount, duration_days, status, submitted_at, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, 'PENDING', NOW(), NOW(), NOW())`,
    [uuid(), project1Id, freelancer1Id, 'أهلاً، أنا أحمد مطور Full Stack متخصص في Next.js و Node.js. لدي خبرة في بناء منصات تجارة إلكترونية. يمكنني تنفيذ هذا المشروع خلال 45 يوماً وبتقنيات حديثة.', 4500.00, 45]
  );
  await client.query(
    `INSERT INTO proposals (id, project_id, freelancer_id, cover_letter, bid_amount, duration_days, status, submitted_at, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, 'PENDING', NOW(), NOW(), NOW())`,
    [uuid(), project2Id, freelancer2Id, 'مرحباً، أنا ندى مصممة UI/UX. لدي خبرة في تصميم تطبيقات التوصيل. يمكنني توفير تصميمات متكاملة لـ iOS و Android.', 1200.00, 20]
  );
  await client.query(
    `INSERT INTO proposals (id, project_id, freelancer_id, cover_letter, bid_amount, duration_days, status, submitted_at, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, 'PENDING', NOW(), NOW(), NOW())`,
    [uuid(), project4Id, freelancer1Id, 'لدي خبرة واسعة في Google Ads وإدارة حملات التسويق الرقمي. سبق لي إدارة حملات بميزانيات تتجاوز $5000 شهرياً.', 1500.00, 30]
  );

  // Badges
  const badgeData = [
    { name: 'Top Rated', nameAr: 'الأعلى تقييماً', desc: 'لمن حصل على تقييم 4.5+', icon: '⭐', criteria: { minRating: 4.5 } },
    { name: 'Rising Talent', nameAr: 'مبدع صاعد', desc: 'لمستقلين واعدين', icon: '🌱', criteria: { maxProjects: 5 } },
    { name: 'Fast Responder', nameAr: 'سريع الاستجابة', desc: 'يستجيب خلال ساعة', icon: '⚡', criteria: { maxResponseTime: 60 } },
    { name: 'Verified', nameAr: 'موثق', desc: 'حساب موثق', icon: '✅', criteria: { isVerified: true } },
  ];
  for (const b of badgeData) {
    await client.query(
      `INSERT INTO badges (id, name, name_ar, description, icon_url, criteria, is_active, created_at) VALUES ($1, $2, $3, $4, $5, $6, true, NOW())`,
      [uuid(), b.name, b.nameAr, b.desc, b.icon, JSON.stringify(b.criteria)]
    );
  }

  // Platform Settings
  const settings = [
    { key: 'max_proposal_days', value: 90, desc: 'أقصى مدة للمشروع' },
  ];
  for (const s of settings) {
    await client.query(
      `INSERT INTO platform_settings (id, key, value, description, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [uuid(), s.key, JSON.stringify(s.value), s.desc]
    );
  }

  client.release();
  await pool.end();

  console.log('Seed completed successfully!');
  console.log('\nDemo accounts:');
  console.log('  Admin:     admin@jobilo.com / Password123!');
  console.log('  Freelancer: ahmed@example.com / Password123!');
  console.log('  Freelancer: nada@example.com / Password123!');
  console.log('  Client:     sara@example.com / Password123!');
  console.log('  Client:     khaled@example.com / Password123!');
}

main().catch((e) => { console.error(e); process.exit(1); });
