let a = [
    {
        "id": 1,
        "type": "note",
        "name": "project-2",
        "icon": "",
        "description": "project-2 \u63cf\u8ff0",
        "folder": "default",
        "status": "active",
        "is_archived": false,
        "is_recycle": false,
        "is_favor": false,
        "created_at": "2025-12-17 15:46:25",
        "updated_at": "2025-12-17 15:46:25"
    },
    {
        "id": 3,
        "type": "note",
        "name": "project-2",
        "icon": "",
        "description": "project-2 \u63cf\u8ff0",
        "folder": "default",
        "status": "active",
        "is_archived": false,
        "is_recycle": false,
        "is_favor": false,
        "created_at": "2025-11-17 15:46:25",
        "updated_at": "2025-11-17 15:46:25"
    }, {
        "id": 2,
        "type": "note",
        "name": "project-1",
        "icon": "",
        "description": "project-1 \u63cf\u8ff0",
        "folder": "default",
        "status": "active",
        "is_archived": false,
        "is_recycle": false,
        "is_favor": true,
        "created_at": "2025-11-18 15:24:01",
        "updated_at": "2025-11-18 15:33:24"
    }
]

a.sort((a, b) => {
    console.log(a.id - b.id)
    return (new Date(b.updated_at) - new Date(a.updated_at)) * 1
})

// console.log(res.map(item => item.id))
console.log(a.map(item => item.id))
