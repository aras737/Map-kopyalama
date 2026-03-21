-- Basit Map Kopyalama Scripti
local workspace = game:GetService("Workspace")

local function copyMap()
    local clonedMap = Instance.new("Folder")
    clonedMap.Name = "ClonedMap"
    clonedMap.Parent = workspace
    
    for _, obj in pairs(workspace:GetChildren()) do
        if obj:IsA("BasePart") or obj:IsA("Model") then
            local clone = obj:Clone()
            clone.Parent = clonedMap
        end
    end
    
    return clonedMap
end

copyMap()
print("Map kopyalandı!")
