const fs = require('fs');
const file = 'src/app/[domain]/admin/store/homepage/HomepageClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// We need to extract the inner contents of Ticker, Products, Features.
// Ticker inner:
const tickerInnerMatch = content.match(/\{tickerOpen && \(\r?\n\s*<div className="mt-3 ml-2 pl-4 border-l-2 border-gray-100 space-y-4">\r?\n([\s\S]*?)\r?\n\s*<\/div>\r?\n\s*\)\}/);
const tickerInner = tickerInnerMatch ? tickerInnerMatch[1] : '';

// Products inner:
const productsInnerMatch = content.match(/\{productsOpen && \(\r?\n\s*<div className="mt-3 ml-2 pl-4 border-l-2 border-gray-100">\r?\n([\s\S]*?)\r?\n\s*<\/div>\r?\n\s*\)\}/);
const productsInner = productsInnerMatch ? productsInnerMatch[1] : '';

// Features inner:
const featuresInnerMatch = content.match(/\{featuresOpen && \(\r?\n\s*<div className="mt-3 ml-2 pl-4 border-l-2 border-gray-100">\r?\n\s*<div className="bg-gray-50\/50 p-4 md:p-5 rounded-xl border border-gray-100 space-y-5">\r?\n([\s\S]*?)\r?\n\s*<\/div>\r?\n\s*<\/div>\r?\n\s*\)\}/);
const featuresInner = featuresInnerMatch ? featuresInnerMatch[1] : '';

// Now replace the whole block from Layout Order Section to the end of Features
const newBlock = `            {/* Draggable Sections */}
            <div className="space-y-2">
              {isMounted ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={layoutOrder} strategy={verticalListSortingStrategy}>
                    {layoutOrder.map((sectionId) => {
                      if (sectionId === 'ticker') {
                        return (
                          <DraggableSection
                            key={sectionId}
                            id={sectionId}
                            title="Brand/Shipping Ticker"
                            icon={<GlobeAltIcon className="w-5 h-5"/>}
                            isOpen={tickerOpen}
                            toggleOpen={() => setTickerOpen(!tickerOpen)}
                          >
${tickerInner}
                          </DraggableSection>
                        );
                      }
                      if (sectionId === 'products') {
                        return (
                          <DraggableSection
                            key={sectionId}
                            id={sectionId}
                            title="Products List Section"
                            icon={<ShoppingBagIcon className="w-5 h-5"/>}
                            isOpen={productsOpen}
                            toggleOpen={() => setProductsOpen(!productsOpen)}
                          >
${productsInner}
                          </DraggableSection>
                        );
                      }
                      if (sectionId === 'features') {
                        return (
                          <DraggableSection
                            key={sectionId}
                            id={sectionId}
                            title="Content Boxes / Features"
                            icon={<StarIcon className="w-5 h-5"/>}
                            isOpen={featuresOpen}
                            toggleOpen={() => setFeaturesOpen(!featuresOpen)}
                          >
${featuresInner}
                          </DraggableSection>
                        );
                      }
                      return null;
                    })}
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="space-y-3">
                  {layoutOrder.map((id) => (
                    <div key={id} className="p-4 bg-white border border-gray-200 rounded-xl flex items-center gap-3 text-gray-500">
                      <Bars2Icon className="w-5 h-5 opacity-50" />
                      <span className="text-sm font-medium">Loading section...</span>
                    </div>
                  ))}
                </div>
              )}
            </div>`;

content = content.replace(/\{\/\* Layout Order Section \*\/\}[\s\S]*?\{\/\* Features Section \*\/\}[\s\S]*?<\/div>\r?\n\s*<\/div>\r?\n\s*\)\}\r?\n\s*<\/div>/, newBlock);

fs.writeFileSync(file, content);
console.log("Refactoring complete");
