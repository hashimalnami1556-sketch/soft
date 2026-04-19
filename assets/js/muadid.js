const STORAGE_KEY = 'muadid.tasks';

const initialTasks = [
    {
        id: 1,
        title: 'متابعة طلبات الدعم الجديدة',
        details: 'راجع طلبات العملاء في البريد ولوحة المتابعة.',
        done: false,
    },
    {
        id: 2,
        title: 'تحديث خطة اليوم',
        details: 'حدد الأولويات مع فريق العمليات قبل الساعة 11.',
        done: true,
    },
    {
        id: 3,
        title: 'إرسال تقرير موجز',
        details: 'أرسل تقرير الإنجاز اليومي إلى المدير.',
        done: false,
    },
];

const tasksElement = document.getElementById('tasks');
const summaryDate = document.getElementById('summaryDate');
const completedCount = document.getElementById('completedCount');
const totalCount = document.getElementById('totalCount');
const focusTask = document.getElementById('focusTask');
const taskForm = document.getElementById('taskForm');

const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('ar-SA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const loadTasks = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        return [...initialTasks];
    }
    try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
            return parsed;
        }
    } catch (error) {
        return [...initialTasks];
    }
    return [...initialTasks];
};

let tasks = loadTasks();

const saveTasks = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const updateStats = () => {
    const completed = tasks.filter((task) => task.done).length;
    completedCount.textContent = completed.toString();
    totalCount.textContent = tasks.length.toString();

    const pending = tasks.find((task) => !task.done);
    focusTask.textContent = pending ? pending.title : 'لا توجد مهام عاجلة حالياً';
};

const renderTasks = () => {
    tasksElement.innerHTML = '';
    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = `task${task.done ? ' completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.addEventListener('change', () => {
            task.done = checkbox.checked;
            saveTasks();
            renderTasks();
            updateStats();
        });

        const content = document.createElement('div');
        const title = document.createElement('strong');
        title.textContent = task.title;

        const details = document.createElement('small');
        details.textContent = task.details;

        content.appendChild(title);
        content.appendChild(details);

        li.appendChild(checkbox);
        li.appendChild(content);
        tasksElement.appendChild(li);
    });
};

const addTask = (title, details) => {
    tasks.unshift({
        id: Date.now(),
        title,
        details,
        done: false,
    });
    saveTasks();
    renderTasks();
    updateStats();
};

summaryDate.textContent = formatDate();
renderTasks();
updateStats();

if (taskForm) {
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(taskForm);
        const title = formData.get('title')?.toString().trim();
        const details = formData.get('details')?.toString().trim();

        if (!title) {
            return;
        }

        addTask(title, details || 'مهمة جديدة بحاجة إلى متابعة.');
        taskForm.reset();
    });
}
