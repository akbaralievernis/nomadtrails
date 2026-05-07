<?php
/**
 * backend/admin/index.php
 * NOMADTRAILS — Admin Control Panel
 * Place inside OpenServer/XAMPP htdocs under the same vhost as the API.
 */
session_start();
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Response.php';

use KGVip\Core\Database;

$db        = Database::getInstance()->getConnection();
$loggedIn  = !empty($_SESSION['admin_id']);
$loginError = '';

// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $username = htmlspecialchars(trim($_POST['username'] ?? ''));
    $password = $_POST['password'] ?? '';
    $stmt = $db->prepare("SELECT id, password_hash FROM admins WHERE username=?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();
    if ($admin && password_verify($password, $admin['password_hash'])) {
        $_SESSION['admin_id'] = $admin['id'];
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit;
    }
    $loginError = 'Invalid username or password';
}

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}

// Admin CRUD actions
if ($loggedIn && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    // Delete tour
    if ($action === 'delete_tour' && !empty($_POST['id'])) {
        $db->prepare("UPDATE tours SET active=0 WHERE id=?")->execute([(int)$_POST['id']]);
    }
    // Delete location
    if ($action === 'delete_location' && !empty($_POST['id'])) {
        $db->prepare("DELETE FROM locations WHERE id=?")->execute([(int)$_POST['id']]);
    }
    // Update booking status
    if ($action === 'update_booking' && !empty($_POST['id'])) {
        $db->prepare("UPDATE bookings SET status=? WHERE id=?")->execute([
            htmlspecialchars($_POST['status']), (int)$_POST['id']
        ]);
    }
    // Mark message read
    if ($action === 'mark_read' && !empty($_POST['id'])) {
        $db->prepare("UPDATE contact_messages SET is_read=1 WHERE id=?")->execute([(int)$_POST['id']]);
    }
    header('Location: ' . $_SERVER['PHP_SELF'] . '?tab=' . ($_GET['tab'] ?? 'dashboard'));
    exit;
}

// Fetch data for dashboard
$stats = [];
if ($loggedIn) {
    $stats['tours']     = $db->query("SELECT COUNT(*) FROM tours WHERE active=1")->fetchColumn();
    $stats['locations'] = $db->query("SELECT COUNT(*) FROM locations")->fetchColumn();
    $stats['bookings']  = $db->query("SELECT COUNT(*) FROM bookings WHERE status='new'")->fetchColumn();
    $stats['messages']  = $db->query("SELECT COUNT(*) FROM contact_messages WHERE is_read=0")->fetchColumn();

    $tours     = $db->query("SELECT * FROM tours WHERE active=1 ORDER BY id DESC")->fetchAll();
    $locations = $db->query("SELECT * FROM locations ORDER BY sort_order, id")->fetchAll();
    $bookings  = $db->query("SELECT b.*, t.name_en AS tour_name FROM bookings b LEFT JOIN tours t ON b.tour_id=t.id ORDER BY b.created_at DESC LIMIT 50")->fetchAll();
    $messages  = $db->query("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 50")->fetchAll();
}

$tab = $_GET['tab'] ?? 'dashboard';
?>
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>NOMADTRAILS — Admin Panel</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
<style>
:root{--forest:#1a3d2b;--forest-mid:#2d6a4f;--green:#40916c;--gold:#c9a84c;--snow:#f8f9fa;--ink:#0d1117;--grey:#6c757d;--red:#e74c3c;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:var(--snow);color:var(--ink);min-height:100vh;display:flex;}

/* Sidebar */
.sidebar{width:260px;background:var(--forest);color:#fff;min-height:100vh;position:fixed;left:0;top:0;padding:2rem 0;display:flex;flex-direction:column;z-index:100;}
.sidebar-logo{padding:0 1.5rem 2rem;border-bottom:1px solid rgba(255,255,255,0.1);}
.sidebar-logo h1{font-family:'Playfair Display',serif;font-size:1.3rem;color:#fff;}
.sidebar-logo span{font-size:0.65rem;color:var(--gold);letter-spacing:0.15em;text-transform:uppercase;}
.sidebar-nav{padding:1.5rem 0;flex:1;}
.nav-item{display:flex;align-items:center;gap:0.75rem;padding:0.85rem 1.5rem;color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.9rem;font-weight:500;transition:all 0.2s;cursor:pointer;border:none;background:none;width:100%;text-align:left;}
.nav-item:hover,.nav-item.active{background:rgba(255,255,255,0.08);color:#fff;border-left:3px solid var(--gold);}
.nav-item .badge{margin-left:auto;background:var(--gold);color:#fff;border-radius:999px;padding:0.15rem 0.6rem;font-size:0.72rem;font-weight:700;}
.sidebar-logout{padding:1.5rem;}
.sidebar-logout a{display:block;text-align:center;color:rgba(255,255,255,0.5);font-size:0.82rem;text-decoration:none;padding:0.6rem;border:1px solid rgba(255,255,255,0.15);border-radius:8px;transition:all 0.2s;}
.sidebar-logout a:hover{background:rgba(255,255,255,0.08);color:#fff;}

/* Main */
.main{margin-left:260px;flex:1;padding:2.5rem;min-height:100vh;}
.page-header{margin-bottom:2rem;}
.page-header h2{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;}
.page-header p{color:var(--grey);font-size:0.9rem;margin-top:0.25rem;}

/* Stats grid */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;margin-bottom:2.5rem;}
.stat-card{background:#fff;border-radius:16px;padding:1.5rem;border:1px solid rgba(0,0,0,0.05);box-shadow:0 2px 12px rgba(0,0,0,0.05);}
.stat-card .value{font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:700;color:var(--forest);}
.stat-card .label{font-size:0.8rem;color:var(--grey);text-transform:uppercase;letter-spacing:0.08em;margin-top:0.25rem;}

/* Table */
.table-wrap{background:#fff;border-radius:16px;border:1px solid rgba(0,0,0,0.06);overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.05);margin-bottom:2rem;}
.table-head{padding:1.25rem 1.5rem;border-bottom:1px solid rgba(0,0,0,0.06);display:flex;justify-content:space-between;align-items:center;}
.table-head h3{font-weight:700;font-size:1rem;}
table{width:100%;border-collapse:collapse;}
th{padding:0.85rem 1rem;text-align:left;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--grey);background:rgba(0,0,0,0.02);border-bottom:1px solid rgba(0,0,0,0.06);}
td{padding:0.9rem 1rem;font-size:0.88rem;border-bottom:1px solid rgba(0,0,0,0.04);vertical-align:middle;}
tr:last-child td{border-bottom:none;}
tr:hover td{background:rgba(0,0,0,0.015);}

/* Badges */
.badge-status{display:inline-block;padding:0.25rem 0.75rem;border-radius:999px;font-size:0.72rem;font-weight:700;text-transform:uppercase;}
.badge-new{background:rgba(201,168,76,0.15);color:#a07830;}
.badge-contacted{background:rgba(64,145,108,0.15);color:var(--green);}
.badge-confirmed{background:rgba(26,61,43,0.1);color:var(--forest);}
.badge-cancelled{background:rgba(231,76,60,0.1);color:var(--red);}

/* Buttons */
.btn{display:inline-flex;align-items:center;gap:0.4rem;padding:0.5rem 1.1rem;border-radius:8px;font-size:0.82rem;font-weight:600;cursor:pointer;border:none;transition:all 0.2s;text-decoration:none;}
.btn-primary{background:var(--forest);color:#fff;}
.btn-primary:hover{background:var(--forest-mid);}
.btn-danger{background:rgba(231,76,60,0.1);color:var(--red);}
.btn-danger:hover{background:var(--red);color:#fff;}
.btn-sm{padding:0.35rem 0.75rem;font-size:0.78rem;}

/* Login */
.login-wrap{display:flex;align-items:center;justify-content:center;min-height:100vh;width:100%;background:linear-gradient(135deg,#0d1117,#1a3d2b);}
.login-card{background:#fff;border-radius:24px;padding:3rem;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,0.3);}
.login-card h2{font-family:'Playfair Display',serif;font-size:1.8rem;margin-bottom:0.5rem;}
.login-card p{color:var(--grey);font-size:0.88rem;margin-bottom:2rem;}
.form-group{margin-bottom:1.25rem;}
.form-group label{display:block;font-size:0.82rem;font-weight:600;margin-bottom:0.4rem;}
.form-group input,.form-group select{width:100%;padding:0.8rem 1rem;border:1.5px solid #e9ecef;border-radius:10px;font-family:'Inter',sans-serif;font-size:0.92rem;outline:none;transition:border-color 0.2s;}
.form-group input:focus,.form-group select:focus{border-color:var(--green);}
.error-msg{background:rgba(231,76,60,0.1);color:var(--red);padding:0.75rem 1rem;border-radius:8px;font-size:0.85rem;margin-bottom:1rem;}
.unread{font-weight:700;background:rgba(201,168,76,0.06);}

@media(max-width:900px){
  .sidebar{width:200px;}
  .main{margin-left:200px;}
  .stats-grid{grid-template-columns:repeat(2,1fr);}
}
</style>
</head>
<body>

<?php if (!$loggedIn): ?>
<!-- ── LOGIN ─────────────────────────────────────────────────────── -->
<div class="login-wrap">
  <div class="login-card">
    <h2>🏔️ Admin Panel</h2>
    <p>NOMADTRAILS — Content Management</p>
    <?php if ($loginError): ?>
      <div class="error-msg"><?= $loginError ?></div>
    <?php endif; ?>
    <form method="POST">
      <div class="form-group">
        <label>Username</label>
        <input type="text" name="username" required autocomplete="username">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" name="password" required autocomplete="current-password">
      </div>
      <button type="submit" name="login" class="btn btn-primary" style="width:100%;justify-content:center;padding:0.9rem;">
        Sign In
      </button>
    </form>
  </div>
</div>

<?php else: ?>
<!-- ── SIDEBAR ───────────────────────────────────────────────────── -->
<aside class="sidebar">
  <div class="sidebar-logo">
    <h1>NOMADTRAILS</h1>
    <span>Admin Panel</span>
  </div>
  <nav class="sidebar-nav">
    <?php
    $navItems = [
      ['tab'=>'dashboard','icon'=>'📊','label'=>'Dashboard'],
      ['tab'=>'tours','icon'=>'🗺️','label'=>'Tours','badge'=>$stats['tours']],
      ['tab'=>'locations','icon'=>'📍','label'=>'Locations'],
      ['tab'=>'bookings','icon'=>'📋','label'=>'Bookings','badge'=>$stats['bookings']],
      ['tab'=>'messages','icon'=>'✉️','label'=>'Messages','badge'=>$stats['messages']],
    ];
    foreach ($navItems as $item):
    ?>
    <a href="?tab=<?= $item['tab'] ?>" class="nav-item <?= $tab===$item['tab'] ? 'active' : '' ?>">
      <span><?= $item['icon'] ?></span>
      <span><?= $item['label'] ?></span>
      <?php if (!empty($item['badge']) && $item['badge'] > 0): ?>
        <span class="badge"><?= $item['badge'] ?></span>
      <?php endif; ?>
    </a>
    <?php endforeach; ?>
  </nav>
  <div class="sidebar-logout">
    <a href="?logout=1">🚪 Sign Out</a>
  </div>
</aside>

<!-- ── MAIN ──────────────────────────────────────────────────────── -->
<main class="main">

<?php if ($tab === 'dashboard'): ?>
  <div class="page-header">
    <h2>Dashboard</h2>
    <p>Welcome back! Here's your overview.</p>
  </div>
  <div class="stats-grid">
    <div class="stat-card"><div class="value"><?= $stats['tours'] ?></div><div class="label">Active Tours</div></div>
    <div class="stat-card"><div class="value"><?= $stats['locations'] ?></div><div class="label">Destinations</div></div>
    <div class="stat-card"><div class="value"><?= $stats['bookings'] ?></div><div class="label">New Bookings</div></div>
    <div class="stat-card"><div class="value"><?= $stats['messages'] ?></div><div class="label">Unread Messages</div></div>
  </div>

<?php elseif ($tab === 'tours'): ?>
  <div class="page-header">
    <h2>Tours Management</h2>
    <p>Create, edit, and manage all tour packages.</p>
  </div>
  <div class="table-wrap">
    <div class="table-head"><h3>All Tours</h3></div>
    <table>
      <thead><tr><th>ID</th><th>Name</th><th>Days</th><th>Price</th><th>Difficulty</th><th>Rating</th><th>Actions</th></tr></thead>
      <tbody>
      <?php foreach ($tours as $t): ?>
        <tr>
          <td><?= $t['id'] ?></td>
          <td><strong><?= htmlspecialchars($t['name_en']) ?></strong></td>
          <td><?= $t['duration_days'] ?> days</td>
          <td>$<?= number_format($t['price_usd'],0) ?></td>
          <td><?= $t['difficulty'] ?></td>
          <td>⭐ <?= $t['rating'] ?></td>
          <td>
            <form method="POST" style="display:inline" onsubmit="return confirm('Delete this tour?')">
              <input type="hidden" name="action" value="delete_tour">
              <input type="hidden" name="id" value="<?= $t['id'] ?>">
              <button type="submit" class="btn btn-danger btn-sm">Delete</button>
            </form>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>

<?php elseif ($tab === 'locations'): ?>
  <div class="page-header">
    <h2>Destinations</h2>
    <p>Manage all destinations and locations.</p>
  </div>
  <div class="table-wrap">
    <div class="table-head"><h3>All Locations</h3></div>
    <table>
      <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Region</th><th>Featured</th><th>Actions</th></tr></thead>
      <tbody>
      <?php foreach ($locations as $l): ?>
        <tr>
          <td><?= $l['id'] ?></td>
          <td><strong><?= htmlspecialchars($l['name_en']) ?></strong></td>
          <td><?= $l['category'] ?></td>
          <td><?= htmlspecialchars($l['region_en'] ?? '—') ?></td>
          <td><?= $l['featured'] ? '✅' : '—' ?></td>
          <td>
            <form method="POST" style="display:inline" onsubmit="return confirm('Delete this location?')">
              <input type="hidden" name="action" value="delete_location">
              <input type="hidden" name="id" value="<?= $l['id'] ?>">
              <button type="submit" class="btn btn-danger btn-sm">Delete</button>
            </form>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>

<?php elseif ($tab === 'bookings'): ?>
  <div class="page-header">
    <h2>Booking Requests</h2>
    <p>Manage and respond to all booking requests.</p>
  </div>
  <div class="table-wrap">
    <div class="table-head"><h3>All Bookings</h3></div>
    <table>
      <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Tour</th><th>Date</th><th>Guests</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
      <?php foreach ($bookings as $b): ?>
        <tr>
          <td><?= $b['id'] ?></td>
          <td><?= htmlspecialchars($b['full_name']) ?></td>
          <td><?= htmlspecialchars($b['email']) ?></td>
          <td><?= htmlspecialchars($b['tour_name'] ?? '—') ?></td>
          <td><?= $b['preferred_date'] ?? '—' ?></td>
          <td><?= $b['guests'] ?></td>
          <td><span class="badge-status badge-<?= $b['status'] ?>"><?= $b['status'] ?></span></td>
          <td>
            <form method="POST" style="display:inline-flex;gap:0.4rem;align-items:center;">
              <input type="hidden" name="action" value="update_booking">
              <input type="hidden" name="id" value="<?= $b['id'] ?>">
              <select name="status" class="btn btn-sm" style="padding:0.3rem 0.5rem;">
                <?php foreach(['new','contacted','confirmed','cancelled'] as $s): ?>
                  <option value="<?= $s ?>" <?= $b['status']===$s?'selected':'' ?>><?= ucfirst($s) ?></option>
                <?php endforeach; ?>
              </select>
              <button type="submit" class="btn btn-primary btn-sm">Save</button>
            </form>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>

<?php elseif ($tab === 'messages'): ?>
  <div class="page-header">
    <h2>Contact Messages</h2>
    <p>Feedback and enquiries from website visitors.</p>
  </div>
  <div class="table-wrap">
    <div class="table-head"><h3>All Messages</h3></div>
    <table>
      <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Date</th><th>Action</th></tr></thead>
      <tbody>
      <?php foreach ($messages as $m): ?>
        <tr class="<?= !$m['is_read'] ? 'unread' : '' ?>">
          <td><?= $m['id'] ?></td>
          <td><?= htmlspecialchars($m['name']) ?></td>
          <td><?= htmlspecialchars($m['email']) ?></td>
          <td><?= htmlspecialchars($m['subject'] ?? '—') ?></td>
          <td style="max-width:250px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"><?= htmlspecialchars($m['message']) ?></td>
          <td><?= date('d.m.Y H:i', strtotime($m['created_at'])) ?></td>
          <td>
            <?php if (!$m['is_read']): ?>
            <form method="POST" style="display:inline">
              <input type="hidden" name="action" value="mark_read">
              <input type="hidden" name="id" value="<?= $m['id'] ?>">
              <button type="submit" class="btn btn-primary btn-sm">Mark Read</button>
            </form>
            <?php else: ?>
              <span style="color:var(--grey);font-size:0.8rem;">✓ Read</span>
            <?php endif; ?>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>

<?php endif; ?>

</main>
<?php endif; ?>
</body>
</html>
