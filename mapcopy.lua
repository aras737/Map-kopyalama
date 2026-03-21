local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")

local function saveInstance(instance, folder)
    local data = {}
    
    for _, child in pairs(instance:GetChildren()) do
        if child:IsA("BasePart") then
            table.insert(data, {
                Name = child.Name,
                Position = {child.Position.X, child.Position.Y, child.Position.Z},
                Size = {child.Size.X, child.Size.Y, child.Size.Z},
                Color = {child.Color.R, child.Color.G, child.Color.B},
                Material = child.Material.Name
            })
        end
    end
    
    local json = HttpService:JSONEncode(data)
    
    -- Bu kısım executor'üne göre değişir
    writefile("MapData_" .. game.PlaceId .. ".json", json)
    
    return "Map verileri kaydedildi!"
end

-- Kullanımı:
saveInstance(workspace, "MapData")
