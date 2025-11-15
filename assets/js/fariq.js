// Global Variables
let currentTab = 'dashboard';
let currentModal = null;
let deferredPrompt = null;
let isOnline = navigator.onLine;
let isAppInitialized = false;

// Error handling
window.onerror = function(msg, url, line, col, error) {
    console.error('JavaScript Error:', { msg, url, line, col, error });
    return false;
};

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    event.preventDefault();
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(createServiceWorker())
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Create Service Worker inline
function createServiceWorker() {
    const swCode = `
        const CACHE_NAME = 'fariq-v1.0.0';
                const urlsToCache = [
                    '/',
                    'assets/css/fariq.css',
                    'assets/js/fariq.js',
                    'https://cdn.tailwindcss.com',
                    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
                    'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap'
                ];

        self.addEventListener('install', event => {
            event.waitUntil(
                caches.open(CACHE_NAME)
                    .then(cache => cache.addAll(urlsToCache))
            );
        });

        self.addEventListener('fetch', event => {
            event.respondWith(
                caches.match(event.request)
                    .then(response => {
                        if (response) {
                            return response;
                        }
                        return fetch(event.request);
                    }
                )
            );
        });
    `;

    const blob = new Blob([swCode], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
}

// Sample Data
const sampleData = {
    bookings: [
        {
            id: 'B001',
            customer: 'أحمد محمد العلي',
            phone: '0551234567',
            service: 'صيانة دورية',
            date: '2024-01-15',
            time: '10:00',
            status: 'مجدول',
            address: 'الرياض، حي النرجس'
        },
        {
            id: 'B002',
            customer: 'سارة أحمد الفهد',
            phone: '0551234568',
            service: 'إصلاح أعطال',
            date: '2024-01-15',
            time: '14:00',
            status: 'قيد التنفيذ',
            address: 'الرياض، حي العليا'
        },
        {
            id: 'B003',
            customer: 'خالد سعد المطيري',
            phone: '0551234569',
            service: 'تركيب جديد',
            date: '2024-01-14',
            time: '16:00',
            status: 'مكتمل',
            address: 'الرياض، حي المروج'
        }
    ],
    customers: [
        {
            name: 'أحمد محمد العلي',
            phone: '0551234567',
            totalBookings: 8,
            lastService: '2024-01-10',
            rating: 5,
            vip: true
        },
        {
            name: 'سارة أحمد الفهد',
            phone: '0551234568',
            totalBookings: 5,
            lastService: '2024-01-08',
            rating: 4,
            vip: false
        },
        {
            name: 'خالد سعد المطيري',
            phone: '0551234569',
            totalBookings: 12,
            lastService: '2024-01-12',
            rating: 5,
            vip: true
        }
    ],
    services: [
        {
            name: 'صيانة دورية',
            price: 150,
            color: 'blue',
            icon: 'fas fa-tools',
            description: 'تنظيف شامل وفحص دوري'
        },
        {
            name: 'إصلاح أعطال',
            price: 200,
            color: 'red',
            icon: 'fas fa-exclamation-triangle',
            description: 'تشخيص وإصلاح الأعطال'
        },
        {
            name: 'تركيب جديد',
            price: 500,
            color: 'green',
            icon: 'fas fa-plus-circle',
            description: 'تركيب وتشغيل احترافي'
        },
        {
            name: 'تنظيف شامل',
            price: 100,
            color: 'purple',
            icon: 'fas fa-spray-can',
            description: 'تنظيف عميق ومتخصص'
        }
    ],
    invoices: [
        {
            id: 'INV-001',
            customer: 'أحمد محمد العلي',
            amount: 350,
            date: '2024-01-10',
            status: 'مدفوعة'
        },
        {
            id: 'INV-002',
            customer: 'سارة أحمد الفهد',
            amount: 480,
            date: '2024-01-12',
            status: 'معلقة'
        }
    ]
};

// Initialize App
function initializeApp() {
    if (isAppInitialized) return;

    try {
        console.log('Initializing Fariq App...');

        initializeDarkMode();
        initializeNavigation();
        initializeTime();
        initializeOnlineStatus();
        initializePWAFeatures();

        // Wait for DOM to be ready
        setTimeout(() => {
            try {
                populateData();
                populateRecentActivities();
                addEventListeners();

                isAppInitialized = true;
                console.log('App initialized successfully');

                // Show welcome notification
                setTimeout(() => {
                    showNotification('مرحباً بكم في تطبيق فريق!', 'success');
                }, 500);

                // Show install prompt after delay
                setTimeout(() => {
                    showInstallPrompt();
                }, 3000);

            } catch (error) {
                console.error('Error in app initialization:', error);
                showNotification('حدث خطأ في تحميل التطبيق', 'error');
            }
        }, 100);

    } catch (error) {
        console.error('Critical error during app initialization:', error);
        showNotification('خطأ في تشغيل التطبيق', 'error');
    }
}

// Dark Mode
function initializeDarkMode() {
    try {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (!darkModeToggle) {
            console.warn('Dark mode toggle not found');
            return;
        }

        // Check system preference safely
        try {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
            }
        } catch (e) {
            console.warn('Cannot check system dark mode preference:', e);
        }

        // Load saved preference safely
        try {
            const savedDarkMode = localStorage.getItem('darkMode');
            if (savedDarkMode === 'true') {
                document.documentElement.classList.add('dark');
            }
        } catch (e) {
            console.warn('Cannot access localStorage for dark mode:', e);
        }

        darkModeToggle.addEventListener('click', () => {
            try {
                document.documentElement.classList.toggle('dark');
                const isDark = document.documentElement.classList.contains('dark');

                // Save preference safely
                try {
                    localStorage.setItem('darkMode', isDark);
                } catch (e) {
                    console.warn('Cannot save dark mode preference:', e);
                }

                showNotification(isDark ? 'تم تفعيل الوضع المظلم' : 'تم تفعيل الوضع الفاتح');

                // Update theme color safely
                try {
                    const themeColor = isDark ? '#1f2937' : '#4A90E2';
                    const metaTheme = document.querySelector('meta[name="theme-color"]');
                    if (metaTheme) {
                        metaTheme.setAttribute('content', themeColor);
                    }
                } catch (e) {
                    console.warn('Cannot update theme color:', e);
                }
            } catch (e) {
                console.error('Error in dark mode toggle:', e);
            }
        });
    } catch (error) {
        console.error('Error initializing dark mode:', error);
    }
}

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId)?.classList.add('active');

    currentTab = tabId;

    // Hide FAB on certain tabs
    const fab = document.getElementById('fab');
    if (['dashboard', 'ai-support', 'calculator'].includes(tabId)) {
        fab.style.display = 'none';
    } else {
        fab.style.display = 'flex';
    }

    // Analytics
    if ('gtag' in window) {
        gtag('event', 'page_view', {
            page_title: tabId,
            page_location: window.location.href
        });
    }
}

// Time and Date
function initializeTime() {
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }

    updateTime();
    setInterval(updateTime, 60000); // Update every minute
}

// Online Status
function initializeOnlineStatus() {
    const indicator = document.getElementById('offlineIndicator');

    function updateOnlineStatus() {
        if (navigator.onLine) {
            indicator.classList.remove('show');
            isOnline = true;
        } else {
            indicator.classList.add('show');
            isOnline = false;
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
}

// PWA Features
function initializePWAFeatures() {
    // Install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });

    // App installed
    window.addEventListener('appinstalled', () => {
        hideInstallPrompt();
        showNotification('تم تثبيت التطبيق بنجاح!', 'success');
        deferredPrompt = null;
    });
}

function showInstallPrompt() {
    const prompt = document.getElementById('installPrompt');
    if (deferredPrompt && !localStorage.getItem('installPromptDismissed')) {
        prompt.classList.add('show');
    }
}

function hideInstallPrompt() {
    document.getElementById('installPrompt').classList.remove('show');
}

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    }
    hideInstallPrompt();
}

function dismissInstallPrompt() {
    hideInstallPrompt();
    localStorage.setItem('installPromptDismissed', 'true');
}

// Populate Data
function populateData() {
    populateBookings();
    populateCustomers();
    populateServices();
    populateInvoices();
}

function populateRecentActivities() {
    const container = document.getElementById('recentActivities');
    const activities = [
        {
            icon: 'fas fa-check-circle',
            color: 'green',
            title: 'تم إكمال صيانة دورية',
            description: 'أحمد محمد العلي',
            time: 'منذ 5 دقائق'
        },
        {
            icon: 'fas fa-plus-circle',
            color: 'blue',
            title: 'طلب جديد',
            description: 'سارة أحمد الفهد',
            time: 'منذ 15 دقيقة'
        },
        {
            icon: 'fas fa-calendar-plus',
            color: 'yellow',
            title: 'موعد مجدول',
            description: 'خالد سعد المطيري',
            time: 'منذ 30 دقيقة'
        }
    ];

    container.innerHTML = activities.map(activity => `
        <div class="flex items-center space-x-3 space-x-reverse">
            <div class="w-8 h-8 bg-${activity.color}-100 dark:bg-${activity.color}-900/20 rounded-full flex items-center justify-center">
                <i class="${activity.icon} text-${activity.color}-600 text-sm"></i>
            </div>
            <div class="flex-1">
                <p class="font-medium text-sm">${activity.title}</p>
                <p class="text-xs text-gray-500">${activity.description} • ${activity.time}</p>
            </div>
        </div>
    `).join('');
}

function populateBookings() {
    const container = document.getElementById('bookingsList');
    if (!container) return;

    container.innerHTML = sampleData.bookings.map(booking => {
        const statusColors = {
            'مجدول': 'blue',
            'قيد التنفيذ': 'yellow',
            'مكتمل': 'green',
            'ملغي': 'red'
        };
        const color = statusColors[booking.status];

        return `
            <div class="mobile-card haptic-light" onclick="viewBooking('${booking.id}')">
                <div class="flex items-center justify-between mb-2">
                    <span class="font-semibold">${booking.id}</span>
                    <span class="px-2 py-1 text-xs rounded-full bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-200">
                        ${booking.status}
                    </span>
                </div>
                <h3 class="font-semibold text-lg mb-1">${booking.customer}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">${booking.service}</p>
                <div class="flex items-center justify-between text-sm text-gray-500">
                    <div class="flex items-center">
                        <i class="fas fa-calendar ml-2"></i>
                        ${booking.date} - ${booking.time}
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-map-marker-alt ml-1"></i>
                        <span class="text-xs">${booking.address}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function populateCustomers() {
    const container = document.getElementById('customersList');
    if (!container) return;

    container.innerHTML = sampleData.customers.map(customer => {
        const stars = '★'.repeat(customer.rating) + '☆'.repeat(5 - customer.rating);

        return `
            <div class="mobile-card haptic-light" onclick="viewCustomer('${customer.phone}')">
                <div class="flex items-center space-x-3 space-x-reverse mb-3">
                    <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center relative">
                        <i class="fas fa-user text-blue-600 text-lg"></i>
                        ${customer.vip ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center"><i class="fas fa-crown text-white text-xs"></i></div>' : ''}
                    </div>
                    <div class="flex-1">
                        <h3 class="font-semibold">${customer.name}</h3>
                        <p class="text-sm text-gray-500">${customer.phone}</p>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-3 text-center text-sm">
                    <div>
                        <div class="font-semibold text-blue-600">${customer.totalBookings}</div>
                        <div class="text-xs text-gray-500">حجوزات</div>
                    </div>
                    <div>
                        <div class="font-semibold text-green-600">${customer.lastService}</div>
                        <div class="text-xs text-gray-500">آخر خدمة</div>
                    </div>
                    <div>
                        <div class="text-yellow-500">${stars}</div>
                        <div class="text-xs text-gray-500">التقييم</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function populateServices() {
    const container = document.getElementById('servicesList');
    if (!container) return;

    container.innerHTML = sampleData.services.map(service => `
        <div class="mobile-card haptic-light">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="w-12 h-12 bg-${service.color}-100 dark:bg-${service.color}-900/20 rounded-lg flex items-center justify-center">
                        <i class="${service.icon} text-${service.color}-600 text-lg"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold">${service.name}</h3>
                        <p class="text-xs text-gray-500">${service.description}</p>
                        <p class="text-sm font-medium text-${service.color}-600">ابتداءً من ${service.price} ر.س</p>
                    </div>
                </div>
                <button onclick="bookService('${service.name}')" class="mobile-btn-primary rounded-lg px-4 py-2 text-sm haptic-light">
                    احجز
                </button>
            </div>
        </div>
    `).join('');
}

function populateInvoices() {
    const container = document.getElementById('invoicesList');
    if (!container) return;

    container.innerHTML = sampleData.invoices.map(invoice => {
        const statusColors = {
            'مدفوعة': 'green',
            'معلقة': 'yellow',
            'متأخرة': 'red'
        };
        const color = statusColors[invoice.status];

        return `
            <div class="mobile-card haptic-light" onclick="viewInvoice('${invoice.id}')">
                <div class="flex items-center justify-between mb-2">
                    <span class="font-semibold">${invoice.id}</span>
                    <span class="px-2 py-1 text-xs rounded-full bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-200">
                        ${invoice.status}
                    </span>
                </div>
                <h3 class="font-semibold mb-1">${invoice.customer}</h3>
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">${invoice.date}</span>
                    <span class="font-bold text-lg text-primary">${invoice.amount} ر.س</span>
                </div>
            </div>
        `;
    }).join('');
}

// Modal Functions
function openModal(modal) {
    const overlay = document.getElementById('modalOverlay');
    const modalElement = typeof modal === 'string' ? document.getElementById(modal) : modal;

    if (!modalElement) {
        return;
    }

    if (currentModal && currentModal !== modalElement) {
        closeModal();
    }

    currentModal = modalElement;
    overlay.classList.add('active');
    modalElement.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!currentModal) {
        return;
    }

    const overlay = document.getElementById('modalOverlay');
    currentModal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';

    if (currentModal.hasAttribute('data-dynamic-modal')) {
        currentModal.remove();
    }

    currentModal = null;
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');

    notificationText.textContent = message;
    notification.className = `notification show ${type}`;

    setTimeout(() => {
        hideNotification();
    }, 4000);

    // Add to local storage for offline viewing
    try {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.unshift({
            message,
            type,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('notifications', JSON.stringify(notifications.slice(0, 10)));
    } catch (e) {
        console.warn('Cannot save notification to localStorage:', e);
    }
}

function hideNotification() {
    document.getElementById('notification').classList.remove('show');
}

function showLoading() {
    document.getElementById('loadingSpinner').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.remove('active');
}

// AI Support Functions
function sendAIMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    addChatMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Simulate AI response
    setTimeout(() => {
        hideTypingIndicator();
        const response = getAIResponse(message);
        addChatMessage(response, 'ai');
    }, 1000 + Math.random() * 2000);
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');

    if (sender === 'user') {
        messageDiv.className = 'flex items-start space-x-3 space-x-reverse justify-end';
        messageDiv.innerHTML = `
            <div class="bg-primary text-white rounded-lg p-3 max-w-xs">
                <p class="text-sm">${message}</p>
                <div class="text-xs opacity-75 mt-1">${new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <i class="fas fa-user text-gray-600 text-sm"></i>
            </div>
        `;
    } else {
        messageDiv.className = 'flex items-start space-x-3 space-x-reverse';
        messageDiv.innerHTML = `
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <i class="fas fa-robot text-white text-sm"></i>
            </div>
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 max-w-xs">
                <p class="text-sm">${message}</p>
                <div class="text-xs opacity-75 mt-1">${new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        `;
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'flex items-start space-x-3 space-x-reverse';
    typingDiv.innerHTML = `
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <i class="fas fa-robot text-white text-sm"></i>
        </div>
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div class="flex space-x-1">
                <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function getAIResponse(message) {
    const responses = {
        'لا يبرد': 'قد تكون المشكلة في الفلتر المتسخ أو نقص في الغاز. أنصح بفحص الفلتر أولاً وتنظيفه. إذا لم تتحسن المشكلة، قد تحتاج لشحن الغاز من قبل فني مختص.',
        'صوت': 'الأصوات الغريبة قد تكون بسبب تراكم الأتربة أو قطع مفكوكة. أنصح بإيقاف المكيف وفحصه من قبل فني مختص للسلامة.',
        'مياه': 'تسريب المياه عادة ما يكون بسبب انسداد في مصرف المياه. حاول تنظيف المصرف بعناية، وإذا استمرت المشكلة اتصل بالفني.',
        'لا يعمل': 'تأكد من وصول الكهرباء والبريكر أولاً، وافحص بطاريات الريموت. إذا كان كل شيء سليم، فقد تكون المشكلة في اللوحة الإلكترونية.',
        'تبريد ضعيف': 'قد يكون بسبب انسداد الفلتر، أو تسرب في الغاز، أو مشكلة في الضاغط. ابدأ بتنظيف الفلتر والوحدة الخارجية.',
        'فاتورة عالية': 'استهلاك الكهرباء العالي قد يكون بسبب فلتر متسخ، أو تسرب في العزل، أو عدم ضبط درجة الحرارة المناسبة (24°م مثالية).'
    };

    const lowerMessage = message.toLowerCase();
    for (const key in responses) {
        if (lowerMessage.includes(key)) {
            return responses[key];
        }
    }

    // Default responses based on keywords
    if (lowerMessage.includes('سعر') || lowerMessage.includes('تكلفة')) {
        return 'أسعار خدماتنا: صيانة دورية 150 ر.س، إصلاح أعطال من 200 ر.س، تركيب جديد من 500 ر.س، تنظيف شامل 100 ر.س. يمكنك استخدام حاسبة التكلفة للحصول على سعر دقيق.';
    }

    if (lowerMessage.includes('موعد') || lowerMessage.includes('حجز')) {
        return 'يمكنك حجز موعد من خلال تبويب "الحجوزات" أو الضغط على زر "حجز جديد" من الشاشة الرئيسية. نحن متاحون من 8 صباحاً حتى 6 مساءً.';
    }

    return 'شكراً لك على سؤالك. يمكنني مساعدتك في تشخيص مشاكل التكييف الشائعة. حاول وصف المشكلة بتفصيل أكثر أو استخدم الأزرار السريعة أعلاه.';
}

function quickDiagnosis(type) {
    const diagnoses = {
        'not-cooling': 'المكيف لا يبرد بشكل كافي؟\n\n🔧 خطوات التشخيص:\n1. فحص نظافة الفلتر\n2. التأكد من إعدادات درجة الحرارة\n3. فحص الوحدة الخارجية من الأتربة\n4. إذا استمرت المشكلة، قد تحتاج لشحن الغاز\n\n💡 نصيحة: درجة الحرارة المثالية هي 24°م',
        'noise': 'أصوات غريبة من المكيف؟\n\n⚠️ إجراءات الأمان:\n1. أوقف التشغيل فوراً\n2. تأكد من عدم وجود أجسام غريبة\n3. فحص المروحة الخارجية\n4. لا تحاول الإصلاح بنفسك\n\n📞 يُنصح بالاتصال بالفني المختص',
        'water-leak': 'تسريب مياه من المكيف؟\n\n💧 الحلول المقترحة:\n1. تنظيف مصرف المياه بعناية\n2. فحص ميلان الوحدة الداخلية\n3. التأكد من سلامة الأنابيب\n4. فحص فلتر الهواء\n\n⚡ إذا لم تحل المشكلة، احتج فني',
        'power': 'المكيف لا يعمل نهائياً؟\n\n🔌 فحص الكهرباء:\n1. تأكد من البريكر الكهربائي\n2. افحص بطاريات الريموت كنترول\n3. تأكد من وصول التيار للوحدة\n4. فحص كابل الكهرباء\n\n🛠️ إذا كل شيء سليم، المشكلة داخلية'
    };

    addChatMessage(diagnoses[type], 'ai');
}

// Calculator Functions
function calculateCost() {
    const serviceType = document.getElementById('serviceType').value;
    const acSize = parseFloat(document.getElementById('acSize').value);
    const unitCount = parseInt(document.getElementById('unitCount').value);

    let baseCost = 0;
    switch(serviceType) {
        case 'maintenance': baseCost = 150; break;
        case 'repair': baseCost = 200; break;
        case 'installation': baseCost = 500; break;
        case 'cleaning': baseCost = 100; break;
    }

    let sizeMultiplier = 1;
    if (acSize >= 3) sizeMultiplier = 1.4;
    else if (acSize >= 2.5) sizeMultiplier = 1.3;
    else if (acSize >= 2) sizeMultiplier = 1.2;
    else if (acSize >= 1.5) sizeMultiplier = 1.1;

    const totalCost = Math.round(baseCost * sizeMultiplier * unitCount);

    document.getElementById('totalCost').textContent = `${totalCost} ر.س`;
    document.getElementById('costResult').classList.remove('hidden');

    showNotification('تم حساب التكلفة بنجاح');

    // Save calculation to history
    try {
        const calculations = JSON.parse(localStorage.getItem('calculations') || '[]');
        calculations.unshift({
            serviceType,
            acSize,
            unitCount,
            totalCost,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('calculations', JSON.stringify(calculations.slice(0, 10)));
    } catch (e) {
        console.warn('Cannot save calculation to localStorage:', e);
    }
}

// Event Listeners
function addEventListeners() {
    // Chat input enter key
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendAIMessage();
        }
    });

    // Form submissions
    document.getElementById('bookingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        handleBookingSubmission();
    });

    // Search functionality
    const bookingSearch = document.getElementById('bookingSearch');
    if (bookingSearch) {
        bookingSearch.addEventListener('input', (e) => {
            filterBookings(e.target.value);
        });
    }

    const customerSearch = document.getElementById('customerSearch');
    if (customerSearch) {
        customerSearch.addEventListener('input', (e) => {
            filterCustomers(e.target.value);
        });
    }

    // Menu button
    document.getElementById('menuBtn').addEventListener('click', () => {
        showMenu();
    });

    // Notification button
    document.getElementById('notificationBtn').addEventListener('click', () => {
        showNotificationHistory();
    });

    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Handle viewport changes
    window.addEventListener('resize', handleViewportChange);
}

function handleBookingSubmission() {
    const form = document.getElementById('bookingForm');
    const formData = new FormData(form);

    showLoading();

    // Simulate API call
    setTimeout(() => {
        hideLoading();

        // Add to bookings data
        const newBooking = {
            id: 'B' + String(sampleData.bookings.length + 1).padStart(3, '0'),
            customer: formData.get('customerName'),
            phone: formData.get('customerPhone'),
            service: getServiceName(formData.get('serviceType')),
            date: formData.get('date'),
            time: formData.get('time'),
            status: 'مجدول',
            address: formData.get('address') || 'غير محدد'
        };

        sampleData.bookings.unshift(newBooking);
        populateBookings();

        closeModal();
        form.reset();

        showNotification('تم حفظ الحجز بنجاح!', 'success');

        // Switch to bookings tab
        switchTab('bookings');
    }, 2000);
}

function getServiceName(serviceType) {
    const serviceNames = {
        'maintenance': 'صيانة دورية',
        'repair': 'إصلاح أعطال',
        'installation': 'تركيب جديد',
        'cleaning': 'تنظيف شامل'
    };
    return serviceNames[serviceType] || serviceType;
}

function filterBookings(searchTerm) {
    const bookings = document.querySelectorAll('#bookingsList .mobile-card');
    bookings.forEach(booking => {
        const text = booking.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            booking.style.display = 'block';
        } else {
            booking.style.display = 'none';
        }
    });
}

function filterCustomers(searchTerm) {
    const customers = document.querySelectorAll('#customersList .mobile-card');
    customers.forEach(customer => {
        const text = customer.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            customer.style.display = 'block';
        } else {
            customer.style.display = 'none';
        }
    });
}

function handleViewportChange() {
    // Update viewport height for mobile browsers
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}

// Action Functions
function viewBooking(id) {
    showNotification(`عرض تفاصيل الحجز ${id}`);
    // Here you would typically open a detailed view
}

function viewCustomer(phone) {
    showNotification(`عرض تفاصيل العميل ${phone}`);
    // Here you would typically open customer profile
}

function viewInvoice(id) {
    showNotification(`عرض الفاتورة ${id}`);
    // Here you would typically open invoice details
}

function openFilter(type) {
    showNotification(`فتح تصفية ${type}`, 'info');
}

function bookService(serviceName) {
    showNotification(`فتح نموذج حجز خدمة: ${serviceName}`);
    openModal('newBookingModal');
    // Pre-fill service type
    setTimeout(() => {
        const serviceSelect = document.querySelector('[name="serviceType"]');
        const serviceValue = {
            'صيانة دورية': 'maintenance',
            'إصلاح أعطال': 'repair',
            'تركيب جديد': 'installation',
            'تنظيف شامل': 'cleaning'
        };
        serviceSelect.value = serviceValue[serviceName] || '';
    }, 100);
}

function showStats(type) {
    const messages = {
        'completed': 'تم إكمال 8 طلبات اليوم بنجاح',
        'pending': 'يوجد 4 طلبات قيد التنفيذ حالياً',
        'revenue': 'إجمالي إيرادات اليوم: 2,450 ر.س'
    };
    showNotification(messages[type] || 'إحصائيات اليوم');
}

function openQuickActions() {
    const actions = [
        { name: 'حجز سريع', action: () => openModal('newBookingModal') },
        { name: 'اتصال طوارئ', action: () => makeEmergencyCall() },
        { name: 'مشاركة التطبيق', action: () => shareApp() }
    ];

    // Create action sheet
    showActionSheet(actions, 'إجراءات سريعة');
}

function showActionSheet(actions, title = 'إجراءات سريعة') {
    const actionSheet = document.createElement('div');
    actionSheet.className = 'modal-mobile';
    actionSheet.setAttribute('data-dynamic-modal', 'true');
    actionSheet.innerHTML = `
        <div class="swipe-indicator"></div>
        <h3 class="text-xl font-bold mb-4 mt-4">${title}</h3>
    `;

    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'space-y-2';

    actions.forEach(({ name, action }) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'w-full p-4 text-right rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors';
        button.textContent = name;
        button.addEventListener('click', () => {
            closeModal();
            if (typeof action === 'function') {
                setTimeout(action, 0);
            }
        });
        actionsContainer.appendChild(button);
    });

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'w-full p-4 text-center rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 mt-4';
    cancelButton.textContent = 'إلغاء';
    cancelButton.addEventListener('click', () => closeModal());

    actionsContainer.appendChild(cancelButton);
    actionSheet.appendChild(actionsContainer);

    document.body.appendChild(actionSheet);
    openModal(actionSheet);
}

function makeEmergencyCall() {
    if ('navigator' in window && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
    }
    window.location.href = 'tel:+966551234567';
}

function shareApp() {
    if ('navigator' in window && 'share' in navigator) {
        navigator.share({
            title: 'تطبيق فريق - صيانة أجهزة تكييف',
            text: 'أفضل تطبيق لإدارة صيانة أجهزة التكييف',
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const text = `تطبيق فريق - صيانة أجهزة تكييف\n${window.location.href}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            showNotification('تم نسخ رابط التطبيق');
        } else {
            showNotification('مشاركة التطبيق غير مدعومة في هذا المتصفح');
        }
    }
}

function showMenu() {
    const menuActions = [
        { name: '⚙️ الإعدادات', action: () => showSettings() },
        { name: '📊 إحصائيات التطبيق', action: () => showAppStats() },
        { name: '💾 نسخ احتياطي', action: () => createBackup() },
        { name: '📞 اتصل بنا', action: () => contactUs() },
        { name: '❓ المساعدة', action: () => showHelp() },
        { name: 'ℹ️ حول التطبيق', action: () => showAbout() }
    ];

    showActionSheet(menuActions, 'القائمة');
}

function showNotificationHistory() {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    if (notifications.length === 0) {
        showNotification('لا توجد إشعارات محفوظة');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal-mobile';
    modal.setAttribute('data-dynamic-modal', 'true');
    modal.innerHTML = `
        <div class="swipe-indicator"></div>
        <h3 class="text-xl font-bold mb-4 mt-4">الإشعارات</h3>
    `;

    const notificationsContainer = document.createElement('div');
    notificationsContainer.className = 'space-y-3 max-h-96 overflow-y-auto';
    notificationsContainer.innerHTML = notifications.map(notif => `
        <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <p class="text-sm">${notif.message}</p>
            <p class="text-xs text-gray-500 mt-1">${new Date(notif.timestamp).toLocaleString('ar-SA')}</p>
        </div>
    `).join('');

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'w-full p-4 text-center rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 mt-4';
    closeButton.textContent = 'إغلاق';
    closeButton.addEventListener('click', () => closeModal());

    modal.append(notificationsContainer, closeButton);

    document.body.appendChild(modal);
    openModal(modal);
}

function showSettings() {
    showNotification('ميزة الإعدادات قيد التطوير');
}

function showAppStats() {
    const stats = {
        bookings: sampleData.bookings.length,
        customers: sampleData.customers.length,
        services: sampleData.services.length,
        invoices: sampleData.invoices.length
    };

    showNotification(`إحصائيات التطبيق: ${stats.bookings} حجز، ${stats.customers} عميل، ${stats.services} خدمات، ${stats.invoices} فاتورة`);
}

function createBackup() {
    const backup = {
        bookings: sampleData.bookings,
        customers: sampleData.customers,
        timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(backup);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `fariq-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
    showNotification('تم إنشاء النسخة الاحتياطية');
}

function contactUs() {
    window.location.href = 'tel:+966551234567';
}

function showHelp() {
    switchTab('ai-support');
    showNotification('يمكنك طرح أي سؤال على المساعد الذكي');
}

function showAbout() {
    const aboutModal = document.createElement('div');
    aboutModal.className = 'modal-mobile';
    aboutModal.setAttribute('data-dynamic-modal', 'true');
    aboutModal.innerHTML = '<div class="swipe-indicator"></div>';

    const content = document.createElement('div');
    content.className = 'text-center py-8';
    content.innerHTML = `
        <div class="w-20 h-20 bg-gradient-to-r from-primary to-fariq-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-snowflake text-white text-3xl"></i>
        </div>
        <h3 class="text-2xl font-bold mb-2">فريق</h3>
        <p class="text-lg text-primary font-semibold mb-2">صيانة أجهزة تكييف</p>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">الإصدار 2.0.0</p>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">برودة تثق بها • خدمة على مدار الساعة</p>
        <div class="text-right space-y-2 mb-6">
            <div class="flex justify-between">
                <span class="text-sm text-gray-500">تاريخ الإصدار:</span>
                <span class="text-sm font-medium">يناير 2024</span>
            </div>
            <div class="flex justify-between">
                <span class="text-sm text-gray-500">المطور:</span>
                <span class="text-sm font-medium">فريق التطوير</span>
            </div>
            <div class="flex justify-between">
                <span class="text-sm text-gray-500">الترخيص:</span>
                <span class="text-sm font-medium">خاص</span>
            </div>
        </div>
    `;

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'mobile-btn mobile-btn-primary';
    closeButton.textContent = 'إغلاق';
    closeButton.addEventListener('click', () => closeModal());

    content.appendChild(closeButton);
    aboutModal.appendChild(content);

    document.body.appendChild(aboutModal);
    openModal(aboutModal);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Initial viewport setup
document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
